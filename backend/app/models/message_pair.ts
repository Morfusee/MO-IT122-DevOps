import { Template } from '#services/template_config'
import mongoose from 'mongoose'

const MessagePairSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    json_response: {
      type: JSON,
      required: false,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    template: {
      type: String,
      enum: Object.values(Template),
      required: false,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Chat',
    },
  },
  {
    timestamps: true,
  }
)

MessagePairSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id

    return ret
  },
})

const MessagePairModel = mongoose.model('MessagePair', MessagePairSchema)

export default MessagePairModel
