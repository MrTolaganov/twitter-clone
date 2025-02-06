'use server'

import { connectDatabase } from '@/lib/mongoose'
import Notification from '@/model/notification.model'
import { INotification } from '@/types'

export async function sendNotification(receiverId: string, message: string, path: string) {
  try {
    await connectDatabase()
    await Notification.create({ receiver: receiverId, message, path })
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function hasUnreadNotifications(userId: string) {
  try {
    await connectDatabase()
    const unReadNotifications = await Notification.find({
      $and: [{ receiver: userId }, { isRead: false }],
    })
    return { numUnreadNotifications: unReadNotifications.length }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUserNotifications(userId: string) {
  try {
    await connectDatabase()
    const unReadNotifications = await Notification.find({ receiver: userId })
      .sort({ createdAt: -1 })
      .select('message createdAt path')
    await Notification.updateMany({ receiver: userId }, { isRead: true })
    return {
      unReadNotifications: JSON.parse(JSON.stringify(unReadNotifications)) as INotification[],
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await connectDatabase()
    await Notification.findByIdAndDelete(notificationId)
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function clearNotifications(userId: string) {
  try {
    await connectDatabase()
    await Notification.deleteMany({ receiver: userId })
  } catch (error) {
    throw new Error(error as string)
  }
}
