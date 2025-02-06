'use client'

import { Radio, RadioGroup } from '@/components/ui/radio'
import { langs } from '@/constants'
import useTranslate from '@/hooks/use-translate'
import { Card } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function LangRadio() {
  const { lng } = useParams()
  const { t } = useTranslate()

  return (
    <Card.Root>
      <Card.Body className='bg-secondary'>
        <Card.Title className='pb-6 font-semibold'>{t('selectLanguage')}</Card.Title>
        <RadioGroup defaultValue={lng as string} className='space-y-2'>
          {langs.map(({ name, value }) => (
            <Link key={name} href={`/${value}/settings`} className='block'>
              <label
                className={`
                  py-4 px-2 rounded-md hover:bg-primary-foreground block cursor-pointer
                  ${value === lng ? 'bg-primary-foreground' : 'bg-background'}
                `}
                htmlFor={value}
              >
                <div className='flex items-center justify-between px-4'>
                  <div className='flex items-center space-x-4'>
                    <Radio value={value} id={value} />
                    <div>{t(name)}</div>
                  </div>
                  <Image src={`/${value}.png`} alt={name!} width={20} height={20} />
                </div>
              </label>
            </Link>
          ))}
        </RadioGroup>
      </Card.Body>
    </Card.Root>
  )
}
