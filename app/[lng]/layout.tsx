import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Provider } from '@/components/ui/provider'
import { LayoutProps } from '@/types'
import { Toaster } from '@/components/ui/toaster'
import { languages } from '@/i18n/settings'
import { dir } from 'i18next'
import NextTopLoader from 'nextjs-toploader'
import SessionProvider from '@/components/providers/session.provider'
import './global.css'
import ChakraProvider from '@/components/providers/chakra.provider'
import QueryProvider from '@/components/providers/query.provider'

const montserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.otabektx.uz'),
  title: 'Twitter',
  description: 'This is the Twitter clone project that developed by Otabek Tulaganov',
  authors: [{ name: 'Otabek Tulaganov', url: 'https://www.otabektx.uz' }],
  icons: {
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjljjHnedCRCaCfzQwcK6qkflmLoUHgRpZAw&s',
  },
  openGraph: {
    title: 'Twitter',
    description: 'This is the Twitter clone project that developed by Otabek Tulaganov',
    images: 'https://utfs.io/f/73W6mq93YPC0cD3U78hPkVjZhxX6peTwySuMndA3Krs1IQUN',
    type: 'website',
    url: 'https://www.otabektx.uz',
    locale: 'en_US',
    emails: 'tulaganovok04@mail.com',
    siteName: 'Twitter',
    countryName: 'Uzbekistan',
  },
}

export async function generateStaticParams() {
  return languages.map(lng => ({ lng }))
}

export default async function RootLayout({ params, children }: LayoutProps) {
  const { lng } = await params

  return (
    <html lang='en' suppressHydrationWarning dir={dir(lng)}>
      <body
        className={`${montserrat.variable} overflow-x-hidden font-montserrat overflow-y-scroll custom-scrollbar`}
      >
        <QueryProvider>
          <SessionProvider>
            <NextTopLoader
              color='#3182CE'
              initialPosition={0.5}
              crawlSpeed={200}
              height={2}
              crawl={true}
              showSpinner={false}
              easing='ease'
              speed={200}
              shadow='0 0 10px #3182CE,0 0 5px #3182CE'
            />
            <ChakraProvider>
              <Provider>
                {children}
                <Toaster />
              </Provider>
            </ChakraProvider>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
