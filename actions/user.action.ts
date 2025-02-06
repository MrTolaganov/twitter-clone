'use server'

import { connectDatabase } from '@/lib/mongoose'
import Follow from '@/model/follow.model'
import User from '@/model/user.model'
import { IUser } from '@/types'

export async function checkUser(email: string) {
  try {
    await connectDatabase()
    const existedEmail = await User.findOne({ email })
    if (existedEmail) return { isSignedUp: true }
    return { isSignedUp: false }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function register(fullName: string, email: string) {
  try {
    await connectDatabase()
    await User.create({ fullName, email, username: `@${email.split('@').at(0)}` })
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function login(email: string) {
  try {
    await connectDatabase()
    const existedUser = await User.findOne({ email })
    if (!existedUser) return { notSignedUp: true }
    return { notSignedUp: false, fullName: existedUser.fullName }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function updateProfile(_id: string, userData: Partial<IUser>) {
  try {
    await connectDatabase()
    const updatedUser = await User.findByIdAndUpdate(_id, userData, { new: true })
    return { user: JSON.parse(JSON.stringify(updatedUser)) as IUser }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getLastThreeUsers(userId: string) {
  try {
    await connectDatabase()
    let lastThreeUsers: any[] = []
    const allUsersExceptUserId = await User.find({ _id: { $ne: userId } })
    const allUsersExceptFollowerId = await Follow.find({ follower: userId })
      .select('following follower')
      .populate('following follower')

    if (allUsersExceptFollowerId.length) {
      let count: number = 0
      for (const user of allUsersExceptUserId) {
        let isPushed = true
        for (const u of allUsersExceptFollowerId) {
          const exceptUser = u.following._id.toString() === user._id.toString()
          if (exceptUser) {
            isPushed = false
            break
          }
        }

        const followingUser = await Follow.findOne({
          $and: [{ follower: userId }, { following: user._id }],
        })

        if (isPushed) {
          lastThreeUsers.push({ ...user._doc, isFollowing: Boolean(followingUser) })
          count++
        }
        if (count === 5) break
      }
    } else {
      lastThreeUsers = await User.find({ _id: { $ne: userId } })
        .sort({ createdAt: -1 })
        .limit(5)
    }

    return { users: JSON.parse(JSON.stringify(lastThreeUsers)) as IUser[] }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getDetailedUser(username: string, currentUserId: string) {
  try {
    await connectDatabase()
    const user = await User.findOne({ username })
    const followingUser = await Follow.findOne({
      $and: [{ follower: currentUserId }, { following: user?._id }],
    })
    return {
      user: JSON.parse(
        JSON.stringify({ ...user._doc, isFollowing: Boolean(followingUser) })
      ) as IUser,
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUserById(userId: string) {
  try {
    await connectDatabase()
    const user = await User.findById(userId)
    return {
      user: JSON.parse(JSON.stringify(user)) as IUser,
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getExploredUsers(userId: string) {
  try {
    await connectDatabase()
    const usersExceptUserId = await User.find({ _id: { $ne: userId } })
    const allExploredUsers: any[] = []
    for (const user of usersExceptUserId) {
      const followingUser = await Follow.findOne({
        $and: [{ follower: userId }, { following: user._id }],
      })
      allExploredUsers.push({ ...user._doc, isFollowing: Boolean(followingUser) })
    }
    return { exploredUsers: JSON.parse(JSON.stringify(allExploredUsers)) as IUser[] }
  } catch (error) {
    throw new Error(error as string)
  }
}
