'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { addComment, editComment } from '@/actions/comment.action'
import { useSession } from 'next-auth/react'
import useTranslate from '@/hooks/use-translate'
import { IComment, IPost } from '@/types'
import { useCommentForm } from '@/hooks/use-comment-form'
import { sendNotification } from '@/actions/notification.action'
import { toaster } from '../ui/toaster'
import { Button, Field, Fieldset, Textarea } from '@chakra-ui/react'

interface Props {
  post: IPost
  commentData: IComment | null
  commentsData: IComment[]
  setCommentData: (commentData: IComment | null) => void
  setCommentsData: (commentsData: IComment[]) => void
}

export default function CommentForm(props: Props) {
  const { post, commentData, setCommentData, commentsData, setCommentsData } = props
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { t } = useTranslate()
  const { setOpenEditCommentForm } = useCommentForm()


  const formSchema = z.object({
    text: z
      .string()
      .min(3, { message: t('mustBeComment') })
      .max(256),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: commentData ? commentData.text : '' },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    if (commentData) {
      editComment(commentData._id, values.text)
        .then(({ comment }) => {
          setCommentsData(commentsData.map(c => (c._id === commentData._id ? comment : c)))
          setOpenEditCommentForm(false)
          setCommentData(null)
        })
        .catch(() => toaster.create({ title: t('somethingWentWrong') }))
        .finally(() => setIsLoading(false))
    } else {
      addComment(values.text, post._id, session?.currentUser._id!)
        .then(({ comment }) => {
          setCommentsData([...commentsData, comment])
          if (post.author._id !== session?.currentUser._id) {
            sendNotification(
              post.author._id,
              `${session?.currentUser.username} commented your post`,
              `/post/${post._id}`
            )
          }
        })
        .catch(() => toaster.create({ title: t('somethingWentWrong') }))
        .finally(() => {
          setIsLoading(false)
          form.reset()
        })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
      <Fieldset.Root>
        <Fieldset.Content>
          <Field.Root disabled={isLoading} invalid={!!form.formState.errors.text}>
            <Textarea
              placeholder={`${t('commentItOut')}...`}
              className='bg-secondary text-sm px-1'
              {...form.register('text')}
              rows={4}
            />
            <Field.ErrorText>{form.formState.errors.text?.message}</Field.ErrorText>
          </Field.Root>
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={isLoading}
              size={'sm'}
              className='bg-primary text-background px-2 font-semibold'
            >
              {t('submit')}
            </Button>
          </div>
        </Fieldset.Content>
      </Fieldset.Root>
    </form>
  )
}
