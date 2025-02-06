import { model, models, Schema } from 'mongoose'

const followSchema = new Schema(
  {
    following: { type: Schema.Types.ObjectId, ref: 'User' },
    follower: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const Follow = models.Follow || model('Follow', followSchema)
export default Follow
