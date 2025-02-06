import { Metadata } from 'next'
import FollowsTabs from './components/follows-tabs'
import { getUserFollowers, getUserFollowings } from '@/actions/follow.action'
import { getServerSession } from 'next-auth'
import { getDetailedUser } from '@/actions/user.action'
import { nextAuthOptions } from '@/lib/auth-options'
import Header from './components/header'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const session = await getServerSession(nextAuthOptions)
  const { user } = await getDetailedUser(`@${username.slice(3)}`, session?.currentUser._id!)
  return { title: `Twitter | ${user.fullName}'s follows` }
}

export default async function Page({ params }: Props) {
  const { username } = await params
  const session = await getServerSession(nextAuthOptions)
  const { followings } = await getUserFollowings(`@${username.slice(3)}`)
  const { followers } = await getUserFollowers(`@${username.slice(3)}`)
  const { user } = await getDetailedUser(`@${username.slice(3)}`, session?.currentUser._id!)

  return (
    <div className='md:w-[calc(100vw/3)]'>
      <div className='max-md:h-[56px]'>
        <Header user={user} />
      </div>
      <FollowsTabs followings={followings} followers={followers} />
    </div>
  )
}
