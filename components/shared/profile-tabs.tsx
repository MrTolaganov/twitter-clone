'use client'

import useTranslate from '@/hooks/use-translate'
import { IComment, IPost } from '@/types'
import UserPosts from './user-posts'
import UserComments from './user-comments'
import UserImages from './user-images'
import UserLikes from './user-likes'
import { Tabs } from '@chakra-ui/react'
import { useState } from 'react'

interface Props {
  userPosts: IPost[]
  userComments: IComment[]
  userImages: IPost[]
  userLikes: IPost[]
}

export default function ProfileTabs({ userPosts, userComments, userImages, userLikes }: Props) {
  const { t } = useTranslate()
  const [tabValue, setTabValue] = useState<'likes' | 'comments' | 'images' | 'posts'>('posts')

  return (
    <Tabs.Root defaultValue='posts' className='max-md:mb-[48px]'>
      <Tabs.List className='grid w-full grid-cols-4 border-b border-muted-foreground'>
        <Tabs.Trigger
          value='posts'
          className={`text-center block font-semibold ${
            tabValue === 'posts' ? 'text-primary bg-secondary' : 'text-muted-foreground'
          }`}
          onClick={() => setTabValue('posts')}
        >
          {userPosts.length} {userPosts.length > 1 ? t('posts') : t('post')}
        </Tabs.Trigger>
        <Tabs.Trigger
          value='comments'
          className={`text-center block font-semibold ${
            tabValue === 'comments' ? 'text-primary bg-secondary' : 'text-muted-foreground'
          }`}
          onClick={() => setTabValue('comments')}
        >
          {userComments.length} {userComments.length > 1 ? t('comments') : t('comment')}
        </Tabs.Trigger>
        <Tabs.Trigger
          value='images'
          className={`text-center block font-semibold ${
            tabValue === 'images' ? 'text-primary bg-secondary' : 'text-muted-foreground'
          }`}
          onClick={() => setTabValue('images')}
        >
          {userImages.length} {userImages.length > 1 ? t('images') : t('image')}
        </Tabs.Trigger>
        <Tabs.Trigger
          value='likes'
          className={`text-center block font-semibold ${
            tabValue === 'likes' ? 'text-primary bg-secondary' : 'text-muted-foreground'
          }`}
          onClick={() => setTabValue('likes')}
        >
          {userLikes.length} {userLikes.length > 1 ? t('likes') : t('like')}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value='posts'>
        <UserPosts userPosts={userPosts} />
      </Tabs.Content>
      <Tabs.Content value='comments'>
        <UserComments userComments={userComments} />
      </Tabs.Content>
      <Tabs.Content value='images'>
        <UserImages userImages={userImages} />
      </Tabs.Content>
      <Tabs.Content value='likes'>
        <UserLikes userLikes={userLikes} />
      </Tabs.Content>
    </Tabs.Root>
  )
}
