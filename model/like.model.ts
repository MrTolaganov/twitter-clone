import { model, models, Schema } from 'mongoose'

const likeSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
})

const Like = models.Like || model('Like', likeSchema)
export default Like
