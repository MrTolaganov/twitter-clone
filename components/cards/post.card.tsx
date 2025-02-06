'use client'

import { IPost } from '@/types'
import { useState } from 'react'
import { Avatar } from '../ui/avatar'
import { Dot, Heart, MessageCircleMore, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import parse from 'html-react-parser'
import { formatDistanceToNowStrict } from 'date-fns'
import { formatPostTime } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useAlert } from '@/hooks/use-alert'
import AlertModal from '../shared/alert-modal'
import { likeAndUnlike } from '@/actions/like.action'
import { sendNotification } from '@/actions/notification.action'
import { usePostAction } from '@/hooks/use-post-action'
import useTranslate from '@/hooks/use-translate'

interface Props {
  post: IPost
  detailed?: boolean
}

export default function PostCard({ post, detailed }: Props) {
  const { _id, text, image, author, createdAt } = post
  const { lng } = useParams()
  const { data: session } = useSession()
  const { setOpenedAlert, setPostId } = useAlert()
  const [loader, setLoader] = useState({ likeLoading: false, commentLoading: false })
  const [postData, setPostData] = useState<IPost>(post)
  const { setPostActionState } = usePostAction()
  const router = useRouter()
  const { t } = useTranslate()

  const onLikeAndUnLike = () => {
    if (loader.likeLoading) return
    setLoader(prev => ({ ...prev, likeLoading: true }))
    likeAndUnlike(_id, session?.currentUser._id!)
      .then(() =>
        setPostData(prev => ({
          ...prev,
          liked: !prev.liked,
          numLikes: prev.liked ? prev.numLikes - 1 : prev.numLikes + 1,
        }))
      )
      .then(() => {
        if (author._id !== session?.currentUser._id) {
          sendNotification(
            author._id,
            `${session?.currentUser.username} ${postData.liked ? 'unliked' : 'liked'} your post`,
            `/post/${_id}`
          )
        }
      })
      .finally(() => setLoader(prev => ({ ...prev, likeLoading: false })))
  }

  const onLikesAndComments = (postActionState: 'likes' | 'comments') => {
    setPostActionState(postActionState)
    router.push(`/${lng}/post/${_id}`)
  }

  return (
    <>
      <div className='flex gap-x-2 border-t p-2 border-muted-foreground'>
        <Link href={`/${lng}/user/${author.username}`}>
          <Avatar
            name={author.fullName!}
            src={
              author.profileImage ||
              'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
            }
            className={`size-10 ${!detailed && 'sticky top-[148px] md:top-[88px]'}`}
          />
        </Link>
        <div className='flex flex-1 flex-col gap-y-2'>
          <div className='flex justify-between gap-x-3'>
            <div className='flex items-center gap-x-1 flex-wrap'>
              <Link href={`/${lng}/user/${author.username}`} className='line-clamp-1'>
                {author.fullName}
              </Link>
              <Link
                href={`/${lng}/user/${author.username}`}
                className='text-muted-foreground text-sm line-clamp-1'
              >
                {author.username}
              </Link>
              <Dot className='text-muted-foreground' />
              <span className='text-muted-foreground text-sm'>
                {formatPostTime(formatDistanceToNowStrict(createdAt))}
              </span>
            </div>
          </div>
          <div
            className='prose dark:prose-invert'
            onClick={() => router.push(`/${lng}/post/${_id}`)}
          >
            {parse(text)}
          </div>
          {image && (
            <Link href={`/${lng}/post/${_id}`}>
              <Image
                src={image}
                alt='Post image'
                width={500}
                height={500}
                priority
                className='object-cover'
              />
            </Link>
          )}
          <div className={`${detailed ? 'hidden' : 'flex items-center gap-x-8 text-sm'}`}>
            <div className='flex items-center gap-x-2 cursor-pointer'>
              <Heart
                className={`size-5 text-destructive ${postData.liked && 'fill-destructive'}`}
                onClick={onLikeAndUnLike}
              />
              <span
                className='line-clamp-1 text-muted-foreground cursor-pointer hover:underline hover:text-foreground'
                onClick={() => onLikesAndComments('likes')}
              >
                {postData.numLikes} {postData.numLikes > 1 ? t('likes') : t('like')}
              </span>
            </div>
            <div
              className='flex items-center gap-x-2 cursor-pointer'
              onClick={() => onLikesAndComments('comments')}
            >
              <MessageCircleMore
                className={`size-5 text-blue-500 ${postData.commented && 'fill-blue-500'}`}
              />
              <span className='line-clamp-1 text-muted-foreground cursor-pointer hover:underline hover:text-foreground'>
                {postData.numComments} {postData.numComments > 1 ? t('comments') : t('comment')}
              </span>
            </div>
          </div>
          {detailed && author._id === session?.currentUser._id && (
            <div className='flex items-center gap-x-8 text-muted-foreground text-sm'>
              <Link href={`/${lng}/edit-post/${_id}`} className='flex items-center gap-x-2'>
                <Pencil className='size-4' />
                <span className='flex-1'>{t('editPost')}</span>
              </Link>
              <div
                className='cursor-pointer flex items-center gap-x-2 hover:text-destructive'
                onClick={() => {
                  setOpenedAlert(true)
                  setPostId(_id)
                }}
              >
                <Trash2 className='size-4 text-destructive 0' />
                <span className='text-destructive flex-1 0'>{t('deletePost')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <AlertModal />
    </>
  )
}
