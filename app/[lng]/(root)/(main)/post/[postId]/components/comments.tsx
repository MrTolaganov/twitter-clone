'use client'

import { deleteComment, getPostComments } from '@/actions/comment.action'
import CommentForm from '@/components/forms/comment.form'
import { Avatar } from '@/components/ui/avatar'
import { toaster } from '@/components/ui/toaster'
import { useCommentForm } from '@/hooks/use-comment-form'
import useTranslate from '@/hooks/use-translate'
import { formatPostTime } from '@/lib/utils'
import { IComment, IPost } from '@/types'
import { formatDistanceToNowStrict } from 'date-fns'
import { Loader2, Pencil, Trash2, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  post: IPost
}

export default function Comments({ post }: Props) {
  const [commentsData, setCommentsData] = useState<IComment[]>([])
  const { lng } = useParams()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslate()
  const { openEditCommentForm, setOpenEditCommentForm } = useCommentForm()
  const [commentData, setCommentData] = useState<IComment | null>(null)

  const onGetPostComments = () => {
    getPostComments(post._id, session?.currentUser._id!)
      .then(({ commentedUsers }) => setCommentsData(commentedUsers))
      .catch(() => toaster.create({ type: 'error', title: t('somethingWentWrong') }))
      .finally(() => setIsLoading(false))
  }

  const onDeleteComment = (commentId: string) => {
    deleteComment(commentId)
      .then(() => setCommentsData(prev => prev.filter(comment => comment._id !== commentId)))
      .catch(() => toaster.create({ type: 'error', title: t('somethingWentWrong') }))
  }

  const onOpenEditCommentForm = (comment: IComment) => {
    setCommentData(comment)
    setOpenEditCommentForm(true)
  }

  const onCloseEditCommentForm = () => {
    setCommentData(null)
    setOpenEditCommentForm(false)
  }

  useEffect(() => {
    onGetPostComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='space-y-4 p-4 max-md:mb-[49px]'>
      {!(openEditCommentForm || commentData?._id) && (
        <CommentForm
          post={post}
          commentData={null}
          commentsData={commentsData}
          setCommentData={setCommentData}
          setCommentsData={setCommentsData}
        />
      )}
      <div>
        {isLoading ? (
          <div className='w-full py-4'>
            <Loader2 className='animate-spin mx-auto' />
          </div>
        ) : commentsData.length > 0 ? (
          commentsData.map(comment => (
            <div key={comment._id} className='flex gap-x-2 border-t p-2 border-muted-foreground'>
              <Link href={`/${lng}/user/${comment.user.username}`}>
                <Avatar
                  src={
                    comment.user.profileImage ||
                    'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
                  }
                  name={comment.user.fullName!}
                  className='size-8 sticky top-[158px] md:top-[98px]'
                />
              </Link>
              <div className='flex flex-1 flex-col gap-y-2'>
                <div className='flex justify-between items-start gap-x-3'>
                  <div className='flex items-center gap-x-1 flex-wrap text-sm'>
                    <Link href={`/${lng}/user/${comment.user.username}`} className='line-clamp-1'>
                      {comment.user.fullName}
                    </Link>
                    <Link
                      href={`/${lng}/user/${comment.user.username}`}
                      className='text-muted-foreground text-sm line-clamp-1'
                    >
                      {comment.user.username}
                    </Link>
                    <span className='text-muted-foreground text-sm'>
                      &#x2022; {formatPostTime(formatDistanceToNowStrict(comment.createdAt))}
                    </span>
                  </div>
                  {openEditCommentForm && comment._id === commentData?._id ? (
                    <X size={16} onClick={onCloseEditCommentForm} className='cursor-pointer' />
                  ) : (
                    comment.user._id === session?.currentUser._id && (
                      <div className='flex items-center gap-x-4 text-muted-foreground'>
                        <Pencil
                          size={16}
                          className='hover:text-foreground cursor-pointer'
                          onClick={() => onOpenEditCommentForm(comment)}
                        />
                        <Trash2
                          size={16}
                          className='hover:text-foreground cursor-pointer'
                          onClick={() => onDeleteComment(comment._id)}
                        />
                      </div>
                    )
                  )}
                </div>
                {!(openEditCommentForm && comment._id === commentData?._id) && (
                  <div className='text-sm'>{comment.text}</div>
                )}
                {openEditCommentForm && comment._id === commentData?._id && (
                  <CommentForm
                    post={post}
                    commentData={commentData}
                    commentsData={commentsData}
                    setCommentData={setCommentData}
                    setCommentsData={setCommentsData}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className='text-center py-4'>{t('noCommentsFound')}</div>
        )}
      </div>
    </div>
  )
}
