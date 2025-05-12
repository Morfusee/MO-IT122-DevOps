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
      type: Template,
      required: false,
      ref: 'Template',
      default: Template.DEFAULT,
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
