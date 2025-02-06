import { create } from 'zustand'

type Store = {
  postActionState: 'likes' | 'comments'
  setPostActionState: (postActionState: 'likes' | 'comments') => void
}

export const usePostAction = create<Store>(set => ({
  postActionState: 'likes',
  setPostActionState: postActionState => set({ postActionState }),
}))
