import { model, models, Schema } from 'mongoose'

const chatSchema = new Schema(
  {
    message: { type: String },
    image: { type: String },
    isRead: { type: Boolean, default: false },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const Chat = models.Chat || model('Chat', chatSchema)
export default Chat
