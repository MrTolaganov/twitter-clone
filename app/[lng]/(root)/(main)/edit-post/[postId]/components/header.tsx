'use client'

import { Avatar } from '@/components/ui/avatar'
import useTranslate from '@/hooks/use-translate'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FaXTwitter } from 'react-icons/fa6'

export default function Header() {
  const { lng } = useParams()
  const { data: session } = useSession()
  const { t } = useTranslate()

  return (
    <div className='md:hidden p-2 text-xl font-bold fixed z-50 bg-background w-full flex justify-between items-center border-b border-muted-foreground'>
      <div className='flex items-center gap-x-2'>
        <Link href={`/${lng}/home`}>
          <FaXTwitter className='size-10' />
        </Link>
      </div>
      <span>{t('editPost')}</span>
      <Link href={`/${lng}/profile`}>
        <Avatar
          src={
            session?.currentUser.profileImage ||
            'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
          }
          name={session?.currentUser.fullName!}
        />
      </Link>
    </div>
  )
}
