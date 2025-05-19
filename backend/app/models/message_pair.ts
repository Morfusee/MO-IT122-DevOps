import mongoose from 'mongoose'

export enum Template {
  DEFAULT = 'default',
  TUTOR = 'tutor',
  SUMMARIZE = 'summarize',
  GENERATE_TITLE = 'generate_title',
  GENERATE_IMAGE = 'generate_image',
  EXPLAIN_LIKE_IM_5 = 'explain_like_im_5',
  MULTIPLE_CHOICE_QUESTION = 'multiple_choice_question',
}

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
