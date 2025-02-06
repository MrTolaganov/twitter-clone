import { getServerSession } from 'next-auth'
import Actions from './components/actions'
import Logo from './components/logo'
import { nextAuthOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { ServerLngParams } from '@/types'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Twitter | Auth' }

export default async function Page({ params }: ServerLngParams) {
  const { lng } = await params
  const session = await getServerSession(nextAuthOptions)

  if (session) return redirect(`/${lng}/home`)

  return (
    <main className='p-8 flex flex-col md:flex-row max-md:justify-start max-md:space-y-8 md:justify-evenly items-start md:items-center py-12 md:py-20'>
      <Logo />
      <Actions />
    </main>
  )
}
