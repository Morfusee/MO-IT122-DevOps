import mongoose from 'mongoose'

export enum Template {
  DEFAULT,
  SUMMARIZE,
  GENERATE_TITLE,
  GENERATE_IMAGE,
  EXPLAIN_LIKE_IM_5,
  MULTIPLE_CHOICE_QUESTION,
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
