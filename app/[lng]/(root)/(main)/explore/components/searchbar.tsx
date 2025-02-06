'use client'

import { useSearchQuery } from '@/hooks/use-search-query'
import useTranslate from '@/hooks/use-translate'
import { Input } from '@chakra-ui/react'
import { Search } from 'lucide-react'

export default function Serachbar() {
  const { query, setQuery } = useSearchQuery()
  const { t } = useTranslate()

  return (
    <div className='fixed bg-background z-10 w-[100vw] md:w-[calc(100vw/3)] max-md:mt-[56px] pb-2'>
      <div className='flex items-center ml-[40px] space-y-2'>
        <Search className='text-muted-foreground mr-[-40px] pr-2 z-30' />
        <Input
          className='h-12 bg-secondary rounded-full pl-[40px] w-full'
          placeholder={`${t('search')}...`}
          value={query}
          onChange={e => setQuery(e.target.value!)}
        />
      </div>
    </div>
  )
}
