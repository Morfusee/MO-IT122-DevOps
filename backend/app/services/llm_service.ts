import { Template } from '#models/message_pair'
import TemplateConfig from '../util/template_config.js'
import { ConversationHistory } from '#services/prompt_service'

export interface ConvoGenParams {
  prompt: string
  attachmentUrls: string[]
  template: Template
  history?: ConversationHistory[]
}

export interface GenAI {
  templateConfig: TemplateConfig
  invoke(params: ConvoGenParams): Promise<LLMResponse>
}

export interface LLMResponse {
  text: string
  image: string
}
