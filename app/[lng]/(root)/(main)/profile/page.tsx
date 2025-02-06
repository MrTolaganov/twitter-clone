import { getUserFollowers, getUserFollowings } from '@/actions/follow.action'
import About from './components/about'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/lib/auth-options'
import { getUserImages, getUserPosts } from '@/actions/post.action'
import ProfileTabs from '@/components/shared/profile-tabs'
import Hero from './components/hero'
import { getUserComments } from '@/actions/comment.action'
import { getUserLikes } from '@/actions/like.action'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Twitter | My profile' }

export default async function Page() {
  const session = await getServerSession(nextAuthOptions)
  const { followings } = await getUserFollowings(session?.currentUser.username!)
  const { followers } = await getUserFollowers(session?.currentUser.username!)
  const { userPosts } = await getUserPosts(session?.currentUser._id!)
  const { userComments } = await getUserComments(session?.currentUser._id!)
  const { userImages } = await getUserImages(session?.currentUser._id!)
  const { userLikes } = await getUserLikes(session?.currentUser._id!)

  return (
    <div className='md:w-[calc(100vw/3)]'>
      <Hero />
      <About numFollowings={followings.length} numFollowers={followers.length} />
      <ProfileTabs
        userPosts={userPosts}
        userComments={userComments}
        userImages={userImages}
        userLikes={userLikes}
      />
    </div>
  )
}
