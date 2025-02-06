import { translate } from '@/i18n/server'
import { LayoutProps } from '@/types'
import Link from 'next/link'

export default async function Layout({ children, params }: LayoutProps) {
  const { lng } = await params
  const { t } = await translate(lng)

  return (
    <>
      <div className='h-[5vh] flex items-center justify-center border-b border-muted-foreground fixed inset-0 z-50 bg-background'>
        <h1 className='text-xl font-bold'>
          {t('developedBy')}{' '}
          <Link
            href={'https://t.me/tulaganovok'}
            className='text-blue-500 underline'
            target='_blank'
          >
            Otabek Tulaganov
          </Link>
        </h1>
      </div>
      <main>{children}</main>
    </>
  )
}
