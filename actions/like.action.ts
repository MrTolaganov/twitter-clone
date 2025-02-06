'use server'

import { connectDatabase } from '@/lib/mongoose'
import Follow from '@/model/follow.model'
import Like from '@/model/like.model'
import { IUser } from '@/types'

export async function likeAndUnlike(postId: string, userId: string) {
  try {
    await connectDatabase()
    const existedLike = await Like.findOne({ $and: [{ postId }, { userId }] })
    if (existedLike) {
      await Like.findByIdAndDelete(existedLike._id)
    } else {
      await Like.create({ postId, userId })
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getPostLikes(postId: string, userId: string) {
  try {
    await connectDatabase()
    const likedUsers = await Like.find({ postId }).populate('userId')
    const finalLikesUsers: any[] = []
    for (const likedUser of likedUsers.map(like => like.userId)) {
      const followingUser = await Follow.findOne({
        $and: [{ follower: userId }, { following: likedUser._id }],
      })
      finalLikesUsers.push({ ...likedUser._doc, isFollowing: Boolean(followingUser) })
    }
    return { likedUsers: JSON.parse(JSON.stringify(finalLikesUsers)) as IUser[] }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUserLikes(userId: string) {
  try {
    await connectDatabase()
    const userLikes = await Like.find({ userId }).populate('postId')
    return { userLikes: JSON.parse(JSON.stringify(userLikes.map(userLike => userLike.postId))) }
  } catch (error) {
    throw new Error(error as string)
  }
}
