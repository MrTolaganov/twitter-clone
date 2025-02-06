'use client'

import { usePostAction } from '@/hooks/use-post-action'
import useTranslate from '@/hooks/use-translate'
import Likes from './likes'
import Comments from './comments'
import { IComment, IPost, IUser } from '@/types'
import { Tabs } from '@chakra-ui/react'
import { useState } from 'react'

interface Props {
  post: IPost
  likedUsers: IUser[]
  commentedUsers: IComment[]
}

export default function PostTabs({ post, likedUsers, commentedUsers }: Props) {
  const { t } = useTranslate()
  const { postActionState } = usePostAction()
  const [tabValue, setTabValue] = useState<'likes' | 'comments'>(postActionState)

  return (
    <Tabs.Root defaultValue={postActionState} className='border-t border-muted-foreground'>
      <Tabs.List className='grid w-full grid-cols-2'>
        <Tabs.Trigger
          value='likes'
          className={`text-center block font-semibold ${
            tabValue === 'likes' ? 'text-primary bg-secondary' : 'text-muted-foreground'
          }`}
          onClick={() => setTabValue('likes')}
        >
          {likedUsers.length} {likedUsers.length > 1 ? t('likes') : t('like')}
        </Tabs.Trigger>
        <Tabs.Trigger
          value='comments'
          className={`text-center block font-semibold ${
            tabValue === 'comments' ? 'text-primary bg-secondary' : 'text-muted-foreground'
          }`}
          onClick={() => setTabValue('comments')}
        >
          {commentedUsers.length} {commentedUsers.length > 1 ? t('comments') : t('comment')}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value='likes'>
        <Likes postId={post._id} />
      </Tabs.Content>
      <Tabs.Content value='comments'>
        <Comments post={post} />
      </Tabs.Content>
    </Tabs.Root>
  )
}
