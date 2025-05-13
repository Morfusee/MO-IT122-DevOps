import { Template } from '#models/message_pair'
import LLMService, { LLM } from '#services/llm_service'
import { inject } from '@adonisjs/core'
import Logger from '@adonisjs/core/services/logger'

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
   * @param {string | undefined} template The template that the
   *     prompt should be based on.
   */
  async generateResponse(
    userInput: string,
    template: Template,
    attachmentUrls?: string[]
  ): Promise<PromptResponse> {
    if (!userInput) {
      throw new Error('User input is required')
    }

    if (!this.llmService) {
      throw new Error('LLM service is required')
    }

    try {
      const response = await this.llmService.invoke(userInput, template, attachmentUrls ? [] : [])

      if (!response || !response.response || response.response === '') {
        throw new Error('Failed to generate response')
      }

      const parsedData =
        template === Template.GENERATE_IMAGE
          ? JSON.parse(JSON.stringify({ response: response.response }))
          : JSON.parse(response.response)

      return {
        response: parsedData as JSON,
        image: response.image,
      }
    } catch (error) {
      Logger.error(error)
      return {
        response: JSON.parse('{"error": "Failed to generate response"}') as JSON,
        image: '',
      }
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

export interface PromptResponse {
  response: JSON
  image: string
}
