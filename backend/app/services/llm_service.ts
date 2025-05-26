import { ConversationHistory } from '#services/prompt_service'
import { TemplateValue } from './template_config.js'
import { GeminiLLM } from '#services/llms/gemini_service'

export interface ConvoGenParams {
  prompt: string
  attachmentUrls: string[]
  template: TemplateValue
  history?: ConversationHistory[]
}

export interface GenAI {
  invoke(params: ConvoGenParams): Promise<LLMResponse>
}

export interface LLMResponse {
  text: string
  image: string
}

/**
 * Enum representing the different language models available.
 */
export const LLM = {
  GEMINI: GeminiLLM.create(),
}
