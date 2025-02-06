import { create } from 'zustand'

type Store = {
  postId: string
  openedAlert: boolean
  setOpenedAlert: (openedAlert: boolean) => void
  setPostId: (postId: string) => void
}

export const useAlert = create<Store>(set => ({
  openedAlert: false,
  postId: '',
  setOpenedAlert: openedAlert => set({ openedAlert }),
  setPostId: postId => set({ postId }),
}))
