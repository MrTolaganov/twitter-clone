import { create } from 'zustand'

type Store = {
  query: string
  setQuery: (query: string) => void
}

export const useSearchQuery = create<Store>(set => ({
  query: '',
  setQuery: query => set({ query }),
}))
