import { getDetailedPost } from '@/actions/post.action'
import Header from './components/header'
import PostCard from '@/components/cards/post.card'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/lib/auth-options'
import PostTabs from './components/post-tabs'
import { getPostLikes } from '@/actions/like.action'
import { getPostComments } from '@/actions/comment.action'
import { Metadata } from 'next'
import parse from 'html-react-parser'

interface Props {
  params: Promise<{ postId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params
  const session = await getServerSession(nextAuthOptions)
  const { post } = await getDetailedPost(postId, session?.currentUser._id!)
  return {
    title: `Twitter | ${post.author.fullName}'s post`,
    description: post.text,
    openGraph: {
      title: `Twitter | ${post.author.fullName}'s post`,
      description: parse(post.text).toString(),
      images: post.image,
    },
  }
}

export default async function Page({ params }: Props) {
  const { postId } = await params
  const session = await getServerSession(nextAuthOptions)
  const { post } = await getDetailedPost(postId, session?.currentUser._id!)
  const { likedUsers } = await getPostLikes(postId, session?.currentUser._id!)
  const { commentedUsers } = await getPostComments(postId, session?.currentUser._id!)

  return (
    <div className='md:w-[calc(100vw/3)]'>
      <div className='max-md:h-[56px]'>
        <Header />
      </div>
      <PostCard post={post} detailed />
      <PostTabs post={post} likedUsers={likedUsers} commentedUsers={commentedUsers} />
    </div>
  )
}
