'use client'

import useTranslate from '@/hooks/use-translate'
import LatestPosts from './latest-posts'
import { Tabs } from '@chakra-ui/react'
import PopularPosts from './popular-posts'
import TrendingPosts from './trending-posts'
import { useState } from 'react'

export default function TabBar() {
  const { t } = useTranslate()
  const [tabValue, setTabValue] = useState<'latest' | 'popular' | 'trending'>('latest')

  return (
    <Tabs.Root defaultValue='latest'>
      <Tabs.List className='grid grid-cols-3 fixed bg-background z-10 w-[100vw] md:w-[calc(100vw/3)] max-md:mt-[56px]'>
        <Tabs.Trigger
          value='latest'
          className={`text-center block font-semibold ${
            tabValue === 'latest' ? 'bg-secondary text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setTabValue('latest')}
        >
          {t('latest')}
        </Tabs.Trigger>
        <Tabs.Trigger
          value='popular'
          className={`text-center block font-semibold ${
            tabValue === 'popular' ? 'bg-secondary text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setTabValue('popular')}
        >
          {t('popular')}
        </Tabs.Trigger>
        <Tabs.Trigger
          value='trending'
          className={`text-center block font-semibold ${
            tabValue === 'trending' ? 'bg-secondary text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setTabValue('trending')}
        >
          {t('trending')}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value='latest'>
        <LatestPosts />
      </Tabs.Content>
      <Tabs.Content value='popular'>
        <PopularPosts />
      </Tabs.Content>
      <Tabs.Content value='trending'>
        <TrendingPosts />
      </Tabs.Content>
    </Tabs.Root>
  )
}
