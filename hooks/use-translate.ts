'use client'

import { useTranslation } from '@/i18n/client'
import { useParams } from 'next/navigation'

export default function useTranslate() {
  const { lng } = useParams()
  const { t } = useTranslation(lng as string)
  return { t }
}
