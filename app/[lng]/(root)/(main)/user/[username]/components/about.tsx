'use client'

import { CalendarDays, FileUser, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import useTranslate from '@/hooks/use-translate'
import { useParams, useRouter } from 'next/navigation'
import { IUser } from '@/types'
import { useFollowsTab } from '@/hooks/use-follows-tab'
import { Button } from '@chakra-ui/react'

interface Props {
  user: IUser
  numFollowings: number
  numFollowers: number
}

export default function About({ user, numFollowings, numFollowers }: Props) {
  const { username, fullName, createdAt, location, bio } = user
  const { t } = useTranslate()
  const { lng } = useParams()
  const { setValue } = useFollowsTab()
  const router = useRouter()

  const onClickFollows = (value: 'followings' | 'followers') => {
    setValue(value)
    router.push(`/${lng}/user/${username}/follows`)
  }

  return (
    <div className='py-4 px-4 md:px-8 flex'>
      <div className='space-y-3 flex-1'>
        <div>
          <div className='font-semibold text-lg md:text-xl'>{fullName}</div>
          <div className='text-muted-foreground'>{username}</div>
        </div>
        <div className='flex items-center gap-x-2 text-muted-foreground'>
          <CalendarDays size={14} />
          <span className='text-sm'>
            {t('joinadAt')} {format(createdAt, 'MMM dd, yyyy')}
          </span>
        </div>
        {location && (
          <div className='flex items-center gap-x-2 text-blue-400'>
            <MapPin size={14} />
            <span className='text-sm'>{location}</span>
          </div>
        )}
        {bio && (
          <div className='flex items-center gap-x-2 text-muted-foreground'>
            <FileUser size={14} />
            <span className='text-sm'>{bio}</span>
          </div>
        )}
        <div className='text-sm text-blue-400 flex items-center gap-x-8 lowercase'>
          <div
            className='hover:underline cursor-pointer'
            onClick={() => onClickFollows('followings')}
          >
            {numFollowings} {numFollowings > 1 ? t('followings') : t('following')}
          </div>
          <div
            className='hover:underline cursor-pointer'
            onClick={() => onClickFollows('followers')}
          >
            {numFollowers} {numFollowers > 1 ? t('followers') : t('follower')}
          </div>
        </div>
      </div>
      <Button
      size={'sm'}
        variant={'outline'}
        className='border border-blue-500 text-blue-500 px-2'
        onClick={() => router.push(`/${lng}/message/${user._id}`)}
      >
        {t('message')}
      </Button>
    </div>
  )
}
