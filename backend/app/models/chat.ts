import mongoose from 'mongoose'

export enum Topic {
  Math = 'math',
  Science = 'science',
  English = 'english',
  Filipino = 'filipino',
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

const ChatModel = mongoose.model('Chat', ChatSchema)

export default ChatModel
