import { model, models, Schema } from 'mongoose'

const notificationSchema = new Schema(
  {
    message: { type: String, required: true },
    path: { type: String, required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Notification = models.Notification || model('Notification', notificationSchema)
export default Notification
