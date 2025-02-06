import { Metadata } from 'next'
import Header from '../components/header'
import LangRadio from './components/lang-radio'
import ModeToggle from './components/mode-toggle'

export const metadata: Metadata = { title: 'Twitter | Settings' }

export default function Page() {
  return (
    <div className='md:w-[calc(100vw/3)]'>
      <div className='max-md:h-[56px]'>
        <Header />
      </div>
      <div className='p-4 space-y-4'>
        <ModeToggle />
        <LangRadio />
      </div>
    </div>
  )
}
