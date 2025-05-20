import { Template } from '#models/message_pair'

export default abstract class TemplateConfig {
  abstract default: any
  abstract summarize: any
  abstract generate_title: any
  abstract generate_image: any
  abstract tutor: any
  abstract explain_like_im_5: any
  abstract multiple_choice_question: any

  get(template: Template): any {
    switch (template) {
      case Template.DEFAULT:
        return this.default
      case Template.SUMMARIZE:
        return this.summarize
      case Template.GENERATE_TITLE:
        return this.generate_title
      case Template.GENERATE_IMAGE:
        return this.generate_image
      case Template.TUTOR:
        return this.tutor
      case Template.EXPLAIN_LIKE_IM_5:
        return this.explain_like_im_5
      case Template.MULTIPLE_CHOICE_QUESTION:
        return this.multiple_choice_question
      default:
        return this.default
    }
  }
}

export const AI_TUTOR_INSTRUCTION = `You are an experienced and friendly private tutor who helps \
students understand a wide variety of subjects, including English, Math, Filipino, History, and Science. \
You explain concepts clearly, adapt to the student's level of understanding, and provide examples when \
necessary. Always respond in a supportive, educational tone.

When answering:
- Use simple language appropriate to the student’s level.
- Break down complex ideas into understandable parts.
- Offer examples or analogies to clarify points.
- Encourage curiosity and deeper thinking.
- If asked to explain in Filipino, do so fluently and appropriately.

Always ask if the student wants further explanation, and avoid giving just direct \
answers—prioritize understanding and learning.`
