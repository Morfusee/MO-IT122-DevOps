import TemplateModel from '#models/template'
import LLMService, { LLM } from '#services/llm_service'
import { inject } from '@adonisjs/core'

@inject()
/**
 * Service for generating responses to user input based on a prompt and any
 * attachments that are provided.
 */
export default class PromptService {
  /**
   * Constructor that takes the LLM service to use.
   * @param {LLMService} llmService The LLM service to use.
   */
  constructor(private llmService: LLMService) {}

  /**
   * Generates a response to the user's input based on the provided prompt and
   * any attachments that are provided.
   * @param {string} userInput The user's input.
   * @param {string[] | undefined} attachmentUrls The URLs of any attachments
   *     that are provided.
   * @param {string | undefined} templateId The ID of the template that the
   *     prompt should be based on.
   * @returns {Promise<{ response: string }>} A promise that resolves with an
   *     object containing the generated response.
   */
  async generateResponse(userInput: string, attachmentUrls?: string[], templateId?: string) {
    const template = templateId ? await TemplateModel.findById(templateId).select('prompt') : null

    const prompt = `${template?.prompt || ''}\n\n${userInput}`

    const response = await this.llmService.invoke(prompt, attachmentUrls ? [] : [])

    return {
      response: response.response || 'Failed to generate response',
    }
  }

  /**
   * Creates a new prompt service with the provided LLM service.
   * @param {LLM} llm The LLM service to use.
   * @returns {PromptService} A new prompt service.
   */
  static build(llm: LLM) {
    return new PromptService(new LLMService(llm))
  }
}
