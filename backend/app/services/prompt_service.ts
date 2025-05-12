import TemplateModel from '#models/template'
import { inject } from '@adonisjs/core'
import { GenAI, LLM } from './llm_service.js'
import { Content } from '@google/genai'

@inject()
export default class PromptService {
  constructor() {}

  build(llm?: GenAI) {
    return new PromptResponseGenerator(llm || LLM.GEMINI)
  }
}

interface GenerateResponseParams {
  userInput: string
  attachmentUrls?: string[]
  templateId?: string
  instruction?: string
}

interface GenerateConversationParams {
  userInput: string
  history: Content[]
  templateId?: string
  instruction?: string
}

class PromptResponseGenerator {
  constructor(private llm: GenAI) {
    this.llm = llm
  }

  async generateResponse({
    userInput,
    attachmentUrls,
    templateId,
    instruction,
  }: GenerateResponseParams) {
    const template = templateId ? await TemplateModel.findById(templateId).select('prompt') : null

    const prompt = `${template?.prompt || ''}\n\n${userInput}`

    const response = await this.llm.textGen({
      prompt: prompt,
      attachmentUrls: attachmentUrls ? [] : [],
      instruction: instruction || '',
    })

    return { response: response.response || 'Failed to generate response' }
  }

  async generateConversation({
    userInput,
    history,
    templateId,
    instruction,
  }: GenerateConversationParams) {
    const template = templateId ? await TemplateModel.findById(templateId).select('prompt') : null

    const prompt = `${template?.prompt || ''}\n\n${userInput}`

    const response = await this.llm.convoGen({
      prompt: prompt,
      history: history,
      instruction: instruction || '',
    })

    return { response: response.response || 'Failed to generate response' }
  }
}
