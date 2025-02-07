'use client'

import { ChildProps } from '@/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function QueryProvider({ children }: ChildProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
