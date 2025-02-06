import Header from '../components/header'
import { getExploredUsers } from '@/actions/user.action'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/lib/auth-options'
import UsersList from './components/users-list'
import Serachbar from './components/searchbar'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Twitter | Explore',
}

export default async function Page() {
  const session = await getServerSession(nextAuthOptions)
  const { exploredUsers } = await getExploredUsers(session?.currentUser._id!)

  return (
    <div className='md:w-[calc(100vw/3)] max-md:mb-[49px]'>
      <div className='max-md:max-h-[56px]'>
        <Header />
      </div>
      <div className=''>
        <Serachbar />
      </div>
      <UsersList exploredUsers={exploredUsers} />
    </div>
  )
}
