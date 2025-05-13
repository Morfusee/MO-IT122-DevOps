import { Template } from '#models/message_pair'
import LLMService, { LLM } from '#services/llm_service'
import TemplateModel from '#models/template'
import { inject } from '@adonisjs/core'
import Logger from '@adonisjs/core/services/logger'
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

    const response = await this.llm.convoGen({
      prompt: prompt,
      history: history,
      instruction: instruction || '',
    })
      if (!response || !response.response || response.response === '') {
        throw new Error('Failed to generate response')
      }

      const parsedData =
        template === Template.GENERATE_IMAGE
          ? JSON.parse(JSON.stringify({ response: response.response }))
          : JSON.parse(response.response)

    return { response: response.response || 'Failed to generate response' }
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
