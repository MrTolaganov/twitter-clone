'use client'

import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function CreatePost() {
  const { lng } = useParams()

  return (
    <Link
      href={`/${lng}/create-post`}
      className='md:hidden fixed right-2 bottom-[56px] size-12 bg-blue-500 rounded-full flex items-center justify-center z-40'
    >
      <span className='text-4xl font-bold'>
        <Pencil />
      </span>
    </Link>
  )
}
