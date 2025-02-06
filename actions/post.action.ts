'use server'

import { connectDatabase } from '@/lib/mongoose'
import Comment from '@/model/comment.model'
import Like from '@/model/like.model'
import Post from '@/model/post.model'
import { IPost } from '@/types'

export async function createPost(text: string, image: string, author: string) {
  try {
    await connectDatabase()
    const newPost = await Post.create({ text, image, author })
    return { newPost: JSON.parse(JSON.stringify(newPost)) as IPost }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getLatestPosts(userId: string) {
  try {
    await connectDatabase()
    const latestPosts = await Post.find().populate('author').sort({ createdAt: -1 })
    const finalLatestPosts: any[] = []
    for (const latestPost of latestPosts) {
      const postLikes = await Like.find({ postId: latestPost._id })
      const userLiked = await Like.findOne({ $and: [{ postId: latestPost._id }, { userId }] })
      const postComments = await Comment.find({ post: latestPost._id })
      const userCommented = await Comment.findOne({
        $and: [{ post: latestPost._id }, { user: userId }],
      })
      finalLatestPosts.push({
        ...latestPost._doc,
        numLikes: postLikes.length,
        liked: Boolean(userLiked),
        numComments: postComments.length,
        commented: Boolean(userCommented),
      })
    }
    return { latestPosts: JSON.parse(JSON.stringify(finalLatestPosts)) as IPost[] }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getPopularPosts(userId: string) {
  try {
    await connectDatabase()
    const popularPosts = await Post.find().populate('author')
    const finalPopularPosts: any[] = []
    for (const trendingPost of popularPosts) {
      const postLikes = await Like.find({ postId: trendingPost._id })
      const userLiked = await Like.findOne({ $and: [{ postId: trendingPost._id }, { userId }] })
      const postComments = await Comment.find({ post: trendingPost._id })
      const userCommented = await Comment.findOne({
        $and: [{ post: trendingPost._id }, { user: userId }],
      })
      finalPopularPosts.push({
        ...trendingPost._doc,
        numLikes: postLikes.length,
        liked: Boolean(userLiked),
        numComments: postComments.length,
        commented: Boolean(userCommented),
      })
    }
    return {
      popularPosts: JSON.parse(
        JSON.stringify(finalPopularPosts.sort((a, b) => b.numLikes - a.numLikes))
      ) as IPost[],
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getTrendingPosts(userId: string) {
  try {
    await connectDatabase()
    const trendingPosts = await Post.find().populate('author')
    const finalTrendingPosts: any[] = []
    for (const trendingPost of trendingPosts) {
      const postLikes = await Like.find({ postId: trendingPost._id })
      const userLiked = await Like.findOne({ $and: [{ postId: trendingPost._id }, { userId }] })
      const postComments = await Comment.find({ post: trendingPost._id })
      const userCommented = await Comment.findOne({
        $and: [{ post: trendingPost._id }, { user: userId }],
      })
      finalTrendingPosts.push({
        ...trendingPost._doc,
        numLikes: postLikes.length,
        liked: Boolean(userLiked),
        numComments: postComments.length,
        commented: Boolean(userCommented),
      })
    }
    return {
      trendingPosts: JSON.parse(
        JSON.stringify(finalTrendingPosts.sort((a, b) => b.numComments - a.numComments))
      ) as IPost[],
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getDetailedPost(postId: string, userId: string) {
  try {
    await connectDatabase()
    const post = await Post.findById(postId).populate('author')
    const postLikes = await Like.find({ postId: post._id })
    const userLiked = await Like.findOne({ $and: [{ postId: post._id }, { userId }] })
    return {
      post: JSON.parse(
        JSON.stringify({ ...post._doc, numLikes: postLikes.length, liked: Boolean(userLiked) })
      ) as IPost,
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function editPost(postId: string, text: string, image: string) {
  try {
    await connectDatabase()
    const edietedPost = await Post.findByIdAndUpdate(
      postId,
      { text, image },
      { new: true }
    ).populate('author')
    return { edietedPost: JSON.parse(JSON.stringify(edietedPost)) as IPost }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function deletePost(postId: string) {
  try {
    await connectDatabase()
    await Post.findByIdAndDelete(postId)
    await Like.deleteMany({ postId })
    await Comment.deleteMany({ post: postId })
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUserPosts(userId: string) {
  try {
    await connectDatabase()
    const userPosts = await Post.find({ author: userId }).sort({ createdAt: -1 })
    return { userPosts: JSON.parse(JSON.stringify(userPosts)) as IPost[] }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUserImages(userId: string) {
  try {
    await connectDatabase()
    const userImages = await Post.find({ author: userId }).sort({ createdAt: -1 })
    return {
      userImages: JSON.parse(
        JSON.stringify(userImages.filter(userPost => userPost.image))
      ) as IPost[],
    }
  } catch (error) {
    throw new Error(error as string)
  }
}
