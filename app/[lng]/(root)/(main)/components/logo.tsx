'use client'

import Link from 'next/link'
import { FaXTwitter } from 'react-icons/fa6'

export default function Logo() {
  return (
    <Link href={'/home'}>
      <FaXTwitter size={48} />
    </Link>
  )
}
