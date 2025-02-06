import { ReactNode } from 'react'

export interface ChildProps {
  children: ReactNode
}

export interface ServerLngParams {
  params: Promise<{ lng: string }>
}

export interface LayoutProps extends ServerLngParams, ChildProps {}

export interface LngParams {
  params: { lng: string }
}

export interface IUser {
  _id: string
  username: string
  email: string
  fullName: string
  bio: string
  location: string
  profileImage: string
  backgroundImage: string
  createdAt: Date
  lastMessage: IChat
  isFollowing: boolean
}

export interface IOtp {
  _id: string
  email: string
  otp: string
  expiredAt: Date
}

export interface IError extends Error {
  message: string
}

export interface INotification {
  _id: string
  message: string
  path: string
  createdAt: Date
}

export interface IChat {
  _id: string
  message: string
  image?: string
  isRead: boolean
  sender?: IUser
  receiver: IUser
  createdAt: Date
}

export interface IPost {
  _id: string
  text: string
  image: string
  author: IUser
  liked: boolean
  numLikes: number
  commented: boolean
  numComments: number
  createdAt: Date
}

export interface IComment {
  _id: string
  text: string
  user: IUser
  post: IPost
  createdAt: Date
}
