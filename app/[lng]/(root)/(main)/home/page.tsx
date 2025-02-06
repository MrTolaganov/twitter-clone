import { Metadata } from 'next'
import Header from '../components/header'
import CreatePost from './components/create-post'
import TabBar from './components/tab-bar'

export const metadata: Metadata = { title: 'Twitter | Home' }

export default function Page() {
  return (
    <div className='md:w-[calc(100vw/3)]'>
      <Header />
      <TabBar />
      <CreatePost />
    </div>
  )
}
