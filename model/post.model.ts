import { model, models, Schema } from 'mongoose'

const postSchema = new Schema(
  {
    text: { type: String, required: true },
    image: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const Post = models.Post || model('Post', postSchema)
export default Post
