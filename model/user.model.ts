import { model, models, Schema } from 'mongoose'

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    bio: { type: String },
    location: { type: String },
    profileImage: { type: String },
    backgroundImage: { type: String },
  },
  { timestamps: true }
)

const User = models.User || model('User', userSchema)
export default User
