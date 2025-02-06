import { create } from 'zustand'

type Store = {
  openEditCommentForm: boolean
  setOpenEditCommentForm: (openEditCommentForm: boolean) => void
}

export const useCommentForm = create<Store>(set => ({
  openEditCommentForm: false,
  setOpenEditCommentForm: openEditCommentForm => set({ openEditCommentForm }),
}))
