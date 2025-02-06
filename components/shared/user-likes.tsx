'use client'

import { formatPostTime } from '@/lib/utils'
import { IPost } from '@/types'
import { formatDistanceToNowStrict } from 'date-fns'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import parse from 'html-react-parser'
import useTranslate from '@/hooks/use-translate'

interface Props {
  userLikes: IPost[]
}

export default function UserLikes({ userLikes }: Props) {
  const { lng } = useParams()
  const { t } = useTranslate()
  const roueter = useRouter()

  return (
    <div className='px-4'>
      {userLikes.length > 0 ? (
        userLikes.map(({ _id, text, image, createdAt }) => (
          <div
            key={_id}
            onClick={() => roueter.push(`/${lng}/post/${_id}`)}
            className='block border-b border-muted-foreground py-4'
          >
            <div className='flex gap-x-4 pb-4'>
              <div className='prose dark:prose-invert flex-1'>{parse(text)}</div>
              <span className='text-muted-foreground'>
                &#x2022; {formatPostTime(formatDistanceToNowStrict(createdAt))}
              </span>
            </div>
            {image && (
              <Image
                src={image}
                alt='Post image'
                width={500}
                height={500}
                priority
                className='object-cover'
              />
            )}
          </div>
        ))
      ) : (
        <div className='text-center py-4'>{t('noLikesFound')}</div>
      )}
    </div>
  )
}
