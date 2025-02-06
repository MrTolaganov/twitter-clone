import { Metadata } from 'next'
import Header from '../components/header'
import NotificationList from './components/notification-list'

export const metadata: Metadata = { title: 'Twiter | Notifications' }

export default async function Page() {
  return (
    <div className='md:w-[calc(100vw/3)]'>
      <div className='max-md:h-[56px]'>
        <Header />
      </div>
      <NotificationList />
    </div>
  )
}
