'use client'

import { IUser } from '@/types'
import { useParams } from 'next/navigation'
import { Avatar } from '../ui/avatar'
import useTranslate from '@/hooks/use-translate'
import { useState } from 'react'
import { followAndUnfollow } from '@/actions/follow.action'
import { sendNotification } from '@/actions/notification.action'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toaster } from '../ui/toaster'
import { ringCss } from '@/constants'
import { Button } from '@chakra-ui/react'

export default function UserCard({ _id, fullName, username, profileImage, isFollowing }: IUser) {
  const { lng } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { t } = useTranslate()
  const router = useRouter()
  const [following, setFollowing] = useState(isFollowing)

  const onFollowAndUnFollow = async () => {
    try {
      setIsLoading(true)
      await followAndUnfollow(_id, session?.currentUser._id!)
      await sendNotification(
        _id,
        `${session?.currentUser.username} get started to ${following ? 'unfollow' : 'follow'} you`,
        `/user/${session?.currentUser.username!}`
      )
      setFollowing(prev => !prev)
    } catch (error: any) {
      toaster.create({ type: 'error', title: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const onClickCard = () => {
    router.push(`/${lng}/user/${username}`)
  }

  return (
    <div className='flex items-center justify-between p-2 hover:bg-secondary rounded-full relative'>
      <div className='flex items-center gap-x-2 cursor-pointer flex-1' onClick={onClickCard}>
        <Avatar
          src={
            profileImage ||
            'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
          }
          name={fullName!}
          colorPalette={'blue'}
          css={ringCss}
        />
        <div className='flex flex-col justify-between pr-2'>
          <div className='font-semibold text-sm'>{fullName}</div>
          <div className='text-muted-foreground text-sm'>{username}</div>
        </div>
      </div>
      {session?.currentUser._id !== _id && (
        <Button
          size={'sm'}
          disabled={isLoading}
          className={`rounded-full text-sm font-semibold absolute right-2 px-2 ${
            following
              ? 'bg-background text-primary border border-primary'
              : 'bg-primary text-background'
          }`}
          onClick={onFollowAndUnFollow}
        >
          {following ? t('unfollow') : t('follow')}
        </Button>
      )}
    </div>
  )
}
