'use server'

import { translate } from '@/i18n/server'
import { cookies } from 'next/headers'

export async function getCookieLng() {
  const cookieStore = await cookies()
  const i18next = cookieStore.get('i18next')
  return await translate(i18next?.value as string)
}
