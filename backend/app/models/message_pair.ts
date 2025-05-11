import mongoose from 'mongoose'

const MessagePairSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    response: [
      {
        text: {
          type: String,
          required: false,
          trim: true,
        },
        image: {
          type: String,
          required: false,
          trim: true,
        },
      },
    ],
    template: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Template',
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, //TODO: change to true when chat is implemented
      ref: 'Chat',
    },
  },
  {
    timestamps: true,
  }
)

const MessagePairModel = mongoose.model('MessagePair', MessagePairSchema)

export default MessagePairModel
