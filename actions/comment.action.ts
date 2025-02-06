'use server'

import { connectDatabase } from '@/lib/mongoose'
import Comment from '@/model/comment.model'
import Follow from '@/model/follow.model'
import { IComment } from '@/types'

export async function addComment(text: string, postId: string, userId: string) {
  try {
    await connectDatabase()
    const createdComment = await Comment.create({ text, post: postId, user: userId })
    const newComment = await Comment.findById(createdComment._id).populate('user post')
    return { comment: JSON.parse(JSON.stringify(newComment)) as IComment }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getPostComments(postId: string, userId: string) {
  try {
    await connectDatabase()
    const commentedUsers = await Comment.find({ post: postId }).populate('user post')
    const finalCommentedUsers = []
    for (const commentedUser of commentedUsers) {
      const followingUser = await Follow.findOne({
        $and: [{ follower: userId }, { following: commentedUser._id }],
      })
      finalCommentedUsers.push({ ...commentedUser._doc, isFollowing: Boolean(followingUser) })
    }
    return { commentedUsers: JSON.parse(JSON.stringify(finalCommentedUsers)) as IComment[] }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function deleteComment(commentId: string) {
  try {
    await connectDatabase()
    await Comment.findByIdAndDelete(commentId)
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function editComment(commentId: string, text: string) {
  try {
    await connectDatabase()
    const editedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true }
    ).populate('user post')
    return { comment: JSON.parse(JSON.stringify(editedComment)) as IComment }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUserComments(userId: string) {
  try {
    await connectDatabase()
    const userComments = await Comment.find({ user: userId })
      .populate('user post')
      .sort({ createdAt: -1 })
    return { userComments: JSON.parse(JSON.stringify(userComments)) as IComment[] }
  } catch (error) {
    throw new Error(error as string)
  }
}
