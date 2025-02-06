import { create } from 'zustand'

type Store = {
  numMessages: number
  setNumMessages: (numMessages: number) => void
}

export const useMessage = create<Store>(set => ({
  numMessages: 0,
  setNumMessages: numMessages => set({ numMessages }),
}))
