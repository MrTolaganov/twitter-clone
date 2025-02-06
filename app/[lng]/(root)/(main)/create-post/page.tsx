import CreatePostForm from '@/components/forms/create-post.form'
import Header from './components/header'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Twitter | Create post' }

export default function Page() {
  return (
    <div className='md:w-[calc(100vw/3)]'>
      <div className='max-md:h-[56px]'>
        <Header />
      </div>
      <div className='mb-16 p-4'>
        <CreatePostForm />
      </div>
    </div>
  )
}
