import { Template } from '#models/message_pair'
import { inject } from '@adonisjs/core'
import Logger from '@adonisjs/core/services/logger'
import { GenAI } from './llm_service.js'
import { LLM } from '../util/llm_handler.js'

@inject()
export default class PromptService {
  constructor() {
    Logger.info('PromptService initialized')
  }

  build(llm?: GenAI) {
    Logger.debug(
      `Building PromptResponseGenerator with LLM: ${llm?.constructor?.name || 'Default (GEMINI)'}`
    )
    return new PromptResponseGenerator(llm || LLM.GEMINI)
  }
}

interface GenerateConversationParams {
  userInput: string
  attachmentUrls?: string[]
  history?: ConversationHistory[]
  template?: Template
}

class PromptResponseGenerator {
  constructor(private llm: GenAI) {
    if (!llm || typeof llm.invoke !== 'function') {
      Logger.error('Invalid or missing LLM provided to PromptResponseGenerator')
      throw new Error('Invalid LLM instance')
    }
    Logger.info(`PromptResponseGenerator initialized with LLM: ${llm.constructor.name}`)
  }

  async generateResponse({
    userInput,
    attachmentUrls,
    template,
    history,
  }: GenerateConversationParams): Promise<PromptResponse> {
    if (!userInput) {
      Logger.warn('PromptResponseGenerator: generateResponse called without user input')
      throw new Error('User input is required')
    }

    Logger.info(`Generating response for user input: "${userInput}"`)
    Logger.debug(
      `Attachments: ${JSON.stringify(attachmentUrls)}, Template: ${template}, History length: ${history?.length || 0}`
    )

    try {
      const response = await this.llm.invoke({
        prompt: userInput,
        attachmentUrls: attachmentUrls || [],
        template: template || Template.DEFAULT,
        history: history || [],
      })

      if (!response) {
        Logger.error('LLM returned an invalid response')
      }

      if (template === Template.GENERATE_IMAGE) {
        Logger.info('Returning image generation response')
        return {
          response: JSON.parse(JSON.stringify({ response: response.text })) as JSON,
          image: response.image,
        }
      }

      Logger.info('Returning text response')
      return { response: JSON.parse(response.text), image: '' }
    } catch (error) {
      Logger.error('Error generating response:', error)
      return {
        response: JSON.parse(JSON.stringify({ error: error.message })) as JSON,
        image: '',
      }
    }
  }
}

export interface PromptResponse {
  response: JSON
  image: string
}

export interface ConversationHistory {
  prompt: string
  response: string
}
