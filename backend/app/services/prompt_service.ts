import TemplateModel from '#models/template'
import LLMService, { LLM } from '#services/llm_service'
import { inject } from '@adonisjs/core'

@inject()
export default class PromptService {
  constructor(private llmService: LLMService) {}

  async generateResponse(userInput: string, attachmentUrls?: string[], templateId?: string) {
    const template = templateId ? await TemplateModel.findById(templateId).select('prompt') : null

    const prompt = `${template?.prompt || ''}\n\n${userInput}`

    const response = await this.llmService.invoke(prompt, attachmentUrls ? [] : [])

    return {
      response: response.response || 'Failed to generate response',
    }
  }

  static build(llm: LLM) {
    return new PromptService(new LLMService(llm))
  }
}
