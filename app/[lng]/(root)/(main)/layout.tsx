import { LayoutProps } from '@/types'
import Sidebar from './components/sidebar'
import Aside from './components/aside'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { getLastThreeUsers } from '@/actions/user.action'
import Mobile from './components/mobile'

export default async function Layout({ children, params }: LayoutProps) {
  const { lng } = await params
  const session = await getServerSession(nextAuthOptions)

  if (!session) return redirect(`/${lng}/auth`)

  const { users } = await getLastThreeUsers(session.currentUser._id)

  return (
    <>
      <Sidebar />
      <div className='md:col-span-4 md:pl-[calc(100vw/3)] md:w-[calc(100vw/3)] mt-[5vh]'>
        {children}
      </div>
      <Aside users={users} />
      <Mobile />
    </>
  )
}
