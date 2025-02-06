'use client'

import { ChildProps } from '@/types'
import { ChakraProvider as Chakra, createSystem, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
  },
})

const system = createSystem(config)

export default function ChakraProvider({ children }: ChildProps) {
  return <Chakra value={system}>{children}</Chakra>
}
