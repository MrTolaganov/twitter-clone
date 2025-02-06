import { create } from 'zustand'

type Store = {
  value: 'followings' | 'followers'
  setValue: (value: 'followings' | 'followers') => void
}

export const useFollowsTab = create<Store>(set => ({
  value: 'followings',
  setValue: value => set({ value }),
}))
