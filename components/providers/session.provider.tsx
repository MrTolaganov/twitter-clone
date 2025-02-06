'use client'

import { ChildProps } from '@/types'
import { SessionProvider as Session } from 'next-auth/react'

export default function SessionProvider({ children }: ChildProps) {
  return <Session>{children}</Session>
}
