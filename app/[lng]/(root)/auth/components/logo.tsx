'use client'

import { FaXTwitter } from 'react-icons/fa6'

export default function Logo() {
  return (
    <>
      <FaXTwitter size={64} className='md:hidden' />
      <FaXTwitter size={400} className='max-md:hidden' />
    </>
  )
}
