import { getDetailedUser } from '@/actions/user.action'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import About from './components/about'
import { getUserFollowers, getUserFollowings } from '@/actions/follow.action'
import { getUserImages, getUserPosts } from '@/actions/post.action'
import ProfileTabs from '@/components/shared/profile-tabs'
import Hero from './components/hero'
import { getUserComments } from '@/actions/comment.action'
import { getUserLikes } from '@/actions/like.action'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ username: string; lng: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const session = await getServerSession(nextAuthOptions)
  const { user } = await getDetailedUser(`@${username.slice(3)}`, session?.currentUser._id!)
  return { title: `Twitter | ${user.fullName}'s profile` }
}

export default async function Page({ params }: Props) {
  const { username, lng } = await params
  const session = await getServerSession(nextAuthOptions)
  if (`@${username.slice(3)}` === session?.currentUser.username) return redirect(`/${lng}/profile`)

  const { user } = await getDetailedUser(`@${username.slice(3)}`, session?.currentUser._id!)
  const { followings } = await getUserFollowings(`@${username.slice(3)}`)
  const { followers } = await getUserFollowers(`@${username.slice(3)}`)
  const { userPosts } = await getUserPosts(user._id)
  const { userComments } = await getUserComments(user._id)
  const { userImages } = await getUserImages(user._id)
  const { userLikes } = await getUserLikes(user._id)

  return (
    <div className='md:w-[calc(100vw/3)]'>
      <Hero {...user} />
      <About user={user} numFollowings={followings.length} numFollowers={followers.length} />
      <ProfileTabs
        userPosts={userPosts}
        userComments={userComments}
        userImages={userImages}
        userLikes={userLikes}
      />
    </div>
  )
}
