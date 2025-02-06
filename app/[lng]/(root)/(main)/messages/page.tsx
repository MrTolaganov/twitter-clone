import { Metadata } from 'next'
import Header from '../components/header'
import MessagesList from './components/messages-list'

export const metadata: Metadata = { title: 'Twitter | Messages' }

export default async function Page() {
  return (
    <div className='md:w-[calc(100vw/3)]'>
      <div className='max-md:h-[56px]'>
        <Header />
      </div>
      <MessagesList />
    </div>
  )
}
