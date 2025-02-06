'use client'

import useTranslate from '@/hooks/use-translate'
import { IPost } from '@/types'
import Image from 'next/image'

interface Props {
  userImages: IPost[]
}

export default function UserImages({ userImages }: Props) {
  const { t } = useTranslate()

  return (
    <div className='px-4'>
      {userImages.length > 0 ? (
        userImages.map(({ _id, image }) => (
          <div key={_id} className='py-4 border-b border-muted-foreground'>
            <Image
              src={image}
              alt='Post image'
              width={500}
              height={500}
              priority
              className='object-cover'
            />
          </div>
        ))
      ) : (
        <div className='text-center py-4'>{t('noImagesFound')}</div>
      )}
    </div>
  )
}
