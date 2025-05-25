/**
 * List of all templates
 */
export const Template = {
  DEFAULT: 'default',
  GENERATE_TITLE: 'generate_title',
  TUTOR: 'tutor',
  SUMMARIZE: 'summarize',
  EXPLAIN_LIKE_IM_5: 'explain_like_im_5',
  MULTIPLE_CHOICE_QUESTION: 'multiple_choice_question',
} as const

/**
 * Template keys
 */
export type TemplateKey = keyof typeof Template
/**
 * Template values
 */
export type TemplateValue = (typeof Template)[TemplateKey]

/**
 * Template type interface
 */
export type TemplateConfigType<T> = {
  [key in TemplateValue]: T
}

type GenerateTitleResponse = {
  name: string
  topic: string
}

type TextResponse = {
  response: string
}

type MultipleChoiceQuestionResponse = {
  response: string
  question: string
  answer: string
  options: string[]
}[]

export type TemplateResponseMap = {
  default: TextResponse
  tutor: TextResponse
  summarize: TextResponse
  explain_like_im_5: TextResponse
  generate_title: GenerateTitleResponse
  multiple_choice_question: MultipleChoiceQuestionResponse
}
