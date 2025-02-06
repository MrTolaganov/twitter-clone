'use client'

import { clearChatContacts, deleteChatContact, getChatContacts } from '@/actions/chat.action'
import { Avatar } from '@/components/ui/avatar'
import { toaster } from '@/components/ui/toaster'
import { useMessage } from '@/hooks/use-message'
import useTranslate from '@/hooks/use-translate'
import { IUser } from '@/types'
import { Button } from '@chakra-ui/react'
import { Loader2, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MessagesList() {
  const { lng } = useParams()
  const { data: session } = useSession()
  const [allContacts, setAllContacts] = useState<IUser[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslate()
  const { setNumMessages } = useMessage()

  const onDelete = (userId: string) => {
    setIsLoading(true)
    deleteChatContact(session?.currentUser._id!, userId)
      .then(({ numMessages }) => {
        setAllContacts(prev => prev.filter(contact => contact._id !== userId))
        setNumMessages(numMessages)
      })
      .catch(() => toaster.create({ type: 'error', title: t('somethingWentWrong') }))
      .finally(() => setIsLoading(false))
  }

  const onClear = () => {
    setIsLoading(true)
    clearChatContacts(session?.currentUser._id!)
      .then(() => {
        setAllContacts([])
        setNumMessages(0)
      })
      .catch(() => toaster.create({ type: 'error', title: t('somethingWentWrong') }))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    const getAllContacts = async () => {
      try {
        setIsFetching(true)
        const { contacts } = await getChatContacts(session?.currentUser._id!)
        setAllContacts(contacts)
        setIsFetching(false)
      } catch {
        toaster.create({ type: 'error', title: t('somethingWentWrong') })
      }
    }
    if (session?.currentUser._id) {
      getAllContacts()
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
          <div className='w-full'>
            {allContacts.map(({ _id, profileImage, fullName, lastMessage }) => (
              <div
                key={_id}
                className='p-2 hover:bg-secondary block border-t border-muted-foreground'
              >
                <div className='flex items-center gap-x-2'>
                  <Link
                    href={`/${lng}/message/${_id}`}
                    className='flex items-center gap-x-2 flex-1'
                  >
                    <Avatar
                      src={
                        profileImage ||
                        'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
                      }
                      name={fullName!}
                    />
                    <div className='flex flex-col justify-between pr-2'>
                      <div className='font-semibold text-sm'>{fullName}</div>
                      {lastMessage?.image ? (
                        <div className='flex items-center gap-x-2'>
                          <Image
                            src={lastMessage.image}
                            alt='Image'
                            width={30}
                            height={20}
                            className='object-cover'
                          />
                          <span
                            className={`text-sm ${lastMessage.isRead && 'text-muted-foreground'}`}
                          >
                            {t('photo')}
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`text-sm line-clamp-1
                            ${
                              lastMessage.isRead ||
                              (lastMessage.sender?._id === session?.currentUser._id &&
                                'text-muted-foreground')
                            }
                          `}
                        >
                          {lastMessage.message}
                        </div>
                      )}
                    </div>
                  </Link>
                  <Button
                    variant={'outline'}
                    disabled={isLoading}
                    onClick={() => onDelete(_id)}
                    className='text-red-500 border border-red-500'
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {allContacts.length > 0 ? (
            <Button
              variant={'outline'}
              className='mx-auto text-red-500 border border-red-500 px-2 font-semibold'
              disabled={isLoading}
              onClick={onClear}
            >
              {t('clearAll')}
            </Button>
          ) : (
            <span>{t('anyMessages')}</span>
          )}
        </div>
      )}
    </>
  )
}
