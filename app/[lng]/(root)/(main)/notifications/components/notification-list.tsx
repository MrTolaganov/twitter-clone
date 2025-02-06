'use client'

import {
  clearNotifications,
  deleteNotification,
  getUserNotifications,
} from '@/actions/notification.action'
import { toaster } from '@/components/ui/toaster'
import { useNotification } from '@/hooks/use-notification'
import useTranslate from '@/hooks/use-translate'
import { INotification } from '@/types'
import { Button } from '@chakra-ui/react'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaXTwitter } from 'react-icons/fa6'

export default function NotificationList() {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const { lng } = useParams()
  const { setNumNotifications } = useNotification()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const { data: session } = useSession()
  const { t } = useTranslate()

  const onClickNotification = (notificationId: string, path: string) => {
    setIsLoading(true)
    router.push(path)
    deleteNotification(notificationId)
      .catch(() => toaster.create({ type: 'error', title: t('somethingWentWrong') }))
      .finally(() => setIsLoading(false))
  }

  const onClearNotifications = () => {
    setIsLoading(true)
    clearNotifications(session?.currentUser._id!)
      .then(() => setNotifications([]))
      .catch(() => toaster.create({ type: 'error', title: t('somethingWentWrong') }))
      .finally(() => setIsLoading(false))
  }

  const getAllNotifications = async () => {
    try {
      setIsFetching(true)
      const { unReadNotifications } = await getUserNotifications(session?.currentUser._id!)
      setNotifications(unReadNotifications)
      setNumNotifications(0)
      setIsFetching(false)
    } catch {
      toaster.create({ type: 'error', title: t('somethingWentWrong') })
    }
  }

  useEffect(() => {
    if (session?.currentUser._id) {
      getAllNotifications()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.currentUser._id])

  return (
    <>
      {isFetching ? (
        <div className='w-full py-4'>
          <Loader2 className='animate-spin mx-auto' />
        </div>
      ) : (
        <div className='flex flex-col items-center gap-y-4'>
          <div className='relative w-full'>
            {notifications.map(({ _id, path, message, createdAt }) => (
              <div
                key={_id}
                className='flex items-center justify-between p-2 border-t hover:bg-secondary gap-x-2 hover:cursor-pointer'
                onClick={() => onClickNotification(_id, `/${lng}${path}`)}
              >
                <div className='flex items-center gap-x-2'>
                  <FaXTwitter size={32} />
                  <div className='flex-1 flex justify-between items-center'>{message}</div>
                </div>
                <div className='text-muted-foreground'>{format(createdAt, 'MMM dd, yyyy')}</div>
              </div>
            ))}
            {isLoading && (
              <div className='size-full absolute inset-0 flex items-center justify-center opacity-50 bg-muted'>
                <Loader2 className='animate-spin' />
              </div>
            )}
          </div>
          {notifications.length > 0 ? (
            <Button className='bg-destructive' disabled={isLoading} onClick={onClearNotifications}>
              {t('clearAll')}
            </Button>
          ) : (
            <span>{t('anyNotifications')}</span>
          )}
        </div>
      )}
    </>
  )
}
