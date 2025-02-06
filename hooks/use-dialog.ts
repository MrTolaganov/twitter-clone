import { create } from 'zustand'

type Store = {
  openedProfileDialog: boolean
  setOpenedProfileDialog: (openedProfileDialog: boolean) => void
}

export const useDialog = create<Store>(set => ({
  openedProfileDialog: false,
  setOpenedProfileDialog: openedProfileDialog => set({ openedProfileDialog }),
}))
