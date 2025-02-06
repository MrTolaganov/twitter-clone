'use client'

import { Avatar } from '@/components/ui/avatar'
import useTranslate from '@/hooks/use-translate'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { FaXTwitter } from 'react-icons/fa6'

export default function Header() {
  const pathname = usePathname()
  const { t } = useTranslate()
  const { lng } = useParams()
  const { data: session } = useSession()

  return (
    <div className='md:hidden capitalize p-2 text-xl font-bold fixed z-50 bg-background w-full flex justify-between items-center'>
      <div className='flex items-center gap-x-2'>
        <Link href={`/${lng}/home`}>
          <FaXTwitter className='size-10' />
        </Link>
      </div>
      <span className=''>{t(pathname.slice(4))}</span>
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
