import { create } from 'zustand'

type Store = {
  numNotifications: number
  setNumNotifications: (countNotification: number) => void
}

export const useNotification = create<Store>(set => ({
  numNotifications: 0,
  setNumNotifications: numNotifications => set({ numNotifications }),
}))
