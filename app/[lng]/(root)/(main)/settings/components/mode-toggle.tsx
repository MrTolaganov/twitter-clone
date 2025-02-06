'use client'

import { Switch } from '@/components/ui/switch'
import useTranslate from '@/hooks/use-translate'
import { Card } from '@chakra-ui/react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslate()

  return (
    <Card.Root>
      <Card.Body className='flex items-center justify-between pt-4 bg-secondary flex-row'>
        <Card.Title className='font-semibold'>{t('themeMode')}</Card.Title>
        <div className='flex items-center gap-1'>
          <Moon />
          <Switch
            checked={theme === 'light' ? true : false}
            onCheckedChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
          <Sun />
        </div>
      </Card.Body>
    </Card.Root>
  )
}
