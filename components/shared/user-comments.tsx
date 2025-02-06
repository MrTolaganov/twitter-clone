'use client'

import useTranslate from '@/hooks/use-translate'
import { formatPostTime } from '@/lib/utils'
import { IComment } from '@/types'
import { formatDistanceToNowStrict } from 'date-fns'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Props {
  userComments: IComment[]
}

export default function UserComments({ userComments }: Props) {
  const { lng } = useParams()
  const { t } = useTranslate()

  return (
    <div className='px-4'>
      {userComments.length > 0 ? (
        userComments.map(({ _id, text, post, createdAt }) => (
          <Link
            key={_id}
            href={`/${lng}/post/${post._id}`}
            className='block border-b border-muted-foreground py-4'
          >
            <div className='flex gap-x-4 text-sm'>
              <div className='flex-1'>{text}</div>
              <span className='text-muted-foreground'>
                &#x2022; {formatPostTime(formatDistanceToNowStrict(createdAt))}
              </span>
            </div>
          </Link>
        ))
      ) : (
        <div className='text-center py-4'>{t('noCommentsFound')}</div>
      )}
    </div>
  )
}
