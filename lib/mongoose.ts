import { connect, set } from 'mongoose'

let isConnected: boolean = false

export async function connectDatabase() {
  set('strictQuery', true)

  if (!process.env.MONGODB_URI) return console.log('MongoDB connection error')

  if (isConnected) return

  try {
    await connect(process.env.MONGODB_URI, { autoCreate: true })
    console.log('MongoDB connection success')
    isConnected = true
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`)
  }
}
