'use client'

import { CalendarDays, FileUser, LogOut, MapPin } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import useTranslate from '@/hooks/use-translate'
import { useParams, useRouter } from 'next/navigation'
import { useFollowsTab } from '@/hooks/use-follows-tab'
import { Button } from '@chakra-ui/react'

interface Props {
  numFollowings: number
  numFollowers: number
}

export default function About({ numFollowings, numFollowers }: Props) {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const { t } = useTranslate()
  const { lng } = useParams()
  const { setValue } = useFollowsTab()
  const router = useRouter()

  const onClickFollows = (value: 'followings' | 'followers') => {
    setValue(value)
    router.push(`/${lng}/user/${session?.currentUser.username}/follows`)
  }

  useEffect(() => {
    if (session?.currentUser._id) {
      setMounted(true)
    }
  }, [session?.currentUser._id])

  return (
    mounted && (
      <div className='py-4 px-4 md:px-8 flex justify-between'>
        <div className='space-y-3 flex-1'>
          <div>
            <div className='font-semibold text-lg md:text-xl'>{session?.currentUser.fullName}</div>
            <div className='text-muted-foreground'>{session?.currentUser.username}</div>
          </div>
          <div className='flex items-center gap-x-2 text-muted-foreground'>
            <CalendarDays size={14} />
            <span className='text-sm'>
              {t('joinadAt')} {format(new Date(session?.currentUser.createdAt!), 'MMM dd, yyyy')}
            </span>
          </div>
          {session?.currentUser.location && (
            <div className='flex items-center gap-x-2 text-blue-500'>
              <MapPin size={14} />
              <span className='text-sm'>{session.currentUser.location}</span>
            </div>
          )}
          {session?.currentUser.bio && (
            <div className='flex items-center gap-x-2 text-muted-foreground'>
              <FileUser size={14} />
              <span className='text-sm'>{session.currentUser.bio}</span>
            </div>
          )}
          <div className='text-sm text-blue-500 flex items-center gap-x-8 lowercase'>
            <div
              onClick={() => onClickFollows('followings')}
              className='hover:underline hover:cursor-pointer'
            >
              {numFollowings} {numFollowings > 1 ? t('followings') : t('following')}
            </div>
            <div
              onClick={() => onClickFollows('followers')}
              className='hover:underline hover:cursor-pointer'
            >
              {numFollowers} {numFollowers > 1 ? t('followers') : t('follower')}
            </div>
          </div>
        </div>
        <Button
          variant={'outline'}
          className='flex items-center gap-x-2 border border-destructive text-destructive hover:text-destructive px-2'
          onClick={() => signOut({ callbackUrl: `/${lng}/auth` })}
        >
          <LogOut />
          <span className='max-md:hidden'>{t('logOut')}</span>
        </Button>
      </div>
    )
  )
}
