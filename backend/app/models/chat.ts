import mongoose from 'mongoose'
import MessagePairModel from './message_pair.js'

export enum Topic {
  MATH = 'math',
  SCIENCE = 'science',
  ENGLISH = 'english',
  FILIPINO = 'filipino',
}

const ChatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      enum: Object.values(Topic),
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

ChatSchema.post('findOneAndDelete', async (doc) => {
  if (doc) {
    await MessagePairModel.deleteMany({ chat: doc._id })
  }
})

ChatSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id

    return ret
  },
})

const ChatModel = mongoose.model('Chat', ChatSchema)

export default ChatModel
