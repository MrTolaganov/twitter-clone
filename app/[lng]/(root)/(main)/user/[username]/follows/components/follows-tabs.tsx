'use client'

import UserCard from '@/components/cards/user.card'
import { useFollowsTab } from '@/hooks/use-follows-tab'
import useTranslate from '@/hooks/use-translate'
import { IUser } from '@/types'
import { Tabs } from '@chakra-ui/react'

interface Props {
  followings: IUser[]
  followers: IUser[]
}

export default function FollowsTabs({ followings, followers }: Props) {
  const { value, setValue } = useFollowsTab()
  const { t } = useTranslate()

  return (
    <Tabs.Root defaultValue={value}>
      <Tabs.List className='grid w-full grid-cols-2'>
        <Tabs.Trigger
          value='followings'
          className={`lowercase text-center block font-semibold ${
            value === 'followings' ? 'text-primary bg-secondary' : 'text-muted-foreground'
          }`}
          onClick={() => setValue('followings')}
        >
          {followings.length} {followings.length > 1 ? t('followings') : t('following')}
        </Tabs.Trigger>
        <Tabs.Trigger
          value='followers'
          className={`lowercase text-center block font-semibold ${
            value === 'followers' ? 'text-primary bg-secondary' : 'text-muted-foreground'
          }`}
          onClick={() => setValue('followers')}
        >
          {followers.length} {followers.length > 1 ? t('followers') : t('follower')}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value='followings' className='p-2'>
        {followings.length > 0 ? (
          followings.map(following => <UserCard key={following._id} {...following} />)
        ) : (
          <div className='text-center py-4'>{t('noFollowingsFound')}</div>
        )}
      </Tabs.Content>
      <Tabs.Content value='followers' className='p-2'>
        {followers.length > 0 ? (
          followers.map(follower => <UserCard key={follower._id} {...follower} />)
        ) : (
          <div className='text-center py-4'>{t('noFollowersFound')}</div>
        )}
      </Tabs.Content>
    </Tabs.Root>
  )
}
