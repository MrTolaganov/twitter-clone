'use client'

import { followAndUnfollow } from '@/actions/follow.action'
import { sendNotification } from '@/actions/notification.action'
import { Avatar } from '@/components/ui/avatar'
import { toaster } from '@/components/ui/toaster'
import useTranslate from '@/hooks/use-translate'
import { IUser } from '@/types'
import { Button } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Hero({ _id, backgroundImage, profileImage, fullName, isFollowing }: IUser) {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { t } = useTranslate()

  const onFollowAndUnFollow = async () => {
    try {
      setIsLoading(true)
      await followAndUnfollow(_id, session?.currentUser._id!)
      await sendNotification(
        _id,
        `${session?.currentUser.username} get started to ${
          isFollowing ? 'unfollow' : 'follow'
        } you`,
        `/user/${session?.currentUser.username!}`
      )
    } catch (error: any) {
      toaster.create({ type: 'error', title: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='relative h-48 md:h-64'>
      <div className='relative bg-muted-foreground h-36 md:h-48'>
        {backgroundImage && (
          <Link href={backgroundImage} target='_blank'>
            <div className='relative size-full'>
              <Image
                src={backgroundImage}
                alt='Background image'
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              />
            </div>
          </Link>
        )}
        <div className='absolute -bottom-1/4 md:-bottom-1/3 left-8 md:left-16'>
          <Link
            href={
              profileImage ||
              'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
            }
            target='_blank'
          >
            <Avatar
              src={
                profileImage ||
                'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
              }
              name={fullName!}
              className='size-20 md:size-32'
            />
          </Link>
        </div>
      </div>
      <div className='absolute bottom-0 right-4 md:bottom-3 md:right-16'>
        <Button
          size={'sm'}
          disabled={isLoading}
          className={`rounded-full text-sm font-semibold px-2 ${
            isFollowing
              ? 'bg-background text-primary border border-primary'
              : 'bg-primary text-background'
          }`}
          onClick={onFollowAndUnFollow}
        >
          {isFollowing ? t('unfollow') : t('follow')}
        </Button>
      </div>
    </div>
  )
}
