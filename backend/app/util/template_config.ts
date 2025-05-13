import { Template } from '#models/message_pair'
import { GenerateContentConfig } from '@google/genai'

export default abstract class TemplateConfig {
  abstract default: GenerateContentConfig
  abstract summarize: GenerateContentConfig
  abstract generate_title: GenerateContentConfig
  abstract generate_image: GenerateContentConfig
  abstract explain_like_im_5: GenerateContentConfig
  abstract multiple_choice_question: GenerateContentConfig

  get(template: Template): GenerateContentConfig {
    switch (template) {
      case Template.DEFAULT:
        return this.default
      case Template.SUMMARIZE:
        return this.summarize
      case Template.GENERATE_TITLE:
        return this.generate_title
      case Template.GENERATE_IMAGE:
        return this.generate_image
      case Template.EXPLAIN_LIKE_IM_5:
        return this.explain_like_im_5
      case Template.MULTIPLE_CHOICE_QUESTION:
        return this.multiple_choice_question
      default:
        return this.default
    }
  }
}
