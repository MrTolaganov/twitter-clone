'use client'

import { Dot } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'

export default function LoadingPostCard() {
  return (
    <div className='flex gap-x-2 border-t p-2'>
      <Skeleton className='size-10 rounded-full sticky top-[148px] md:top-[88px]' />
      <div className='flex flex-1 flex-col gap-y-2'>
        <div className='flex items-center gap-x-2'>
          <Skeleton className='w-1/3 h-5' />
          <Skeleton className='w-1/4 h-4' />
          <Dot className='text-secondary' />
          <Skeleton className='w-1/6 h-3' />
        </div>
        <Skeleton className='w-2/3 h-4' />
        <Skeleton className='w-1/2 h-4' />
        <Skeleton className='w-3/4 h-4' />
        <Skeleton className='w-full h-48' />
        <div className='flex items-center gap-x-2'>
          <div className='w-1/4 flex items-center gap-x-1'>
            <Skeleton className='size-3 rounded-full' />
            <Skeleton className='h-3 flex-1' />
          </div>
          <div className='w-1/4 flex items-center gap-x-1'>
            <Skeleton className='size-3 rounded-full' />
            <Skeleton className='h-3 flex-1' />
          </div>
        </div>
      </div>
    </div>
  )
}
