import { getDetailedPost } from '@/actions/post.action'
import Header from './components/header'
import EditPostForm from '@/components/forms/edit-post.form'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/lib/auth-options'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ postId: string }>
}

export const metadata: Metadata = { title: 'Twitter | Edit post' }

export default async function Page({ params }: Props) {
  const { postId } = await params
  const session = await getServerSession(nextAuthOptions)
  const { post } = await getDetailedPost(postId, session?.currentUser._id!)

  return (
    <div className='md:w-[calc(100vw/3)]'>
      <div className='max-md:h-[56px]'>
        <Header />
      </div>
      <div className='mb-16 p-4'>
        <EditPostForm {...post} />
      </div>
    </div>
  )
}
