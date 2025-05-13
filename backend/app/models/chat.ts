import mongoose from 'mongoose'

export enum Topic {
  MATH = 'math',
  SCIENCE = 'science',
  ENGLISH = 'english',
  FILIPINO = 'filipino',
}

const ChatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
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
