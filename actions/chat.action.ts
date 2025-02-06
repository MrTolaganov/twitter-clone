'use server'

import { connectDatabase } from '@/lib/mongoose'
import Chat from '@/model/chat.model'
import User from '@/model/user.model'
import { IChat, IUser } from '@/types'

export async function sendChatMessage(
  message: string,
  image: string,
  senderId: string,
  receiverId: string
) {
  try {
    await connectDatabase()
    const newChat = await Chat.create({ message, image, sender: senderId, receiver: receiverId })
    const chat = await Chat.findById(newChat._id).populate('sender receiver')
    return { chat: JSON.parse(JSON.stringify(chat)) as IChat }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUsersChat(senderId: string, receiverId: string) {
  try {
    await connectDatabase()
    const chats = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).populate('sender receiver')
    return { chats: JSON.parse(JSON.stringify(chats)) as IChat[] }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getChatContacts(userId: string) {
  try {
    await connectDatabase()
    const allUsers = await User.find({ _id: { $ne: userId } })
    const allContacts = []
    for (const user of allUsers) {
      const lastMessage = await Chat.findOne({
        $or: [
          { sender: userId, receiver: user._id },
          { sender: user._id, receiver: userId },
        ],
      })
        .populate('sender receiver')
        .sort({ createdAt: -1 })
      allContacts.push({ ...user._doc, lastMessage })
    }
    return {
      contacts: JSON.parse(
        JSON.stringify(
          allContacts
            .filter(contact => contact.lastMessage)
            .sort((a, b) => b.lastMessage.updatedAt - a.lastMessage.updatedAt)
        )
      ) as IUser[],
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function markAsRead(receiverId: string, senderId: string) {
  try {
    await connectDatabase()
    await Chat.updateMany({ receiver: receiverId, sender: senderId }, { isRead: true })
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function hasUnreadMessages(userId: string) {
  try {
    await connectDatabase()
    const userUnreadMessages = await Chat.find({ $and: [{ receiver: userId, isRead: false }] })
    return { numMessages: userUnreadMessages.length }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function deleteMessage(messageId: string) {
  try {
    await connectDatabase()
    await Chat.findByIdAndDelete(messageId)
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function editMessage(messageId: string, message: string) {
  try {
    await connectDatabase()
    const editedChat = await Chat.findByIdAndUpdate(messageId, { message }, { new: true })
    return { editedChat: JSON.parse(JSON.stringify(editedChat)) as IChat }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function deleteChatContact(senderId: string, receiverId: string) {
  try {
    await connectDatabase()
    await Chat.deleteMany({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
    const { numMessages } = await hasUnreadMessages(senderId)
    return { numMessages }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function clearChatContacts(userId: string) {
  try {
    await connectDatabase()
    await Chat.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] })
  } catch (error) {
    throw new Error(error as string)
  }
}
