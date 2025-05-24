import { inject } from '@adonisjs/core'
import Logger from '@adonisjs/core/services/logger'
import { LLM, GenAI } from '#services/llm_service'
import { Template, TemplateResponseMap, TemplateValue } from '#services/template_config'

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
  template?: TemplateValue
}

export interface ConversationHistory {
  prompt: string
  response: string
}

export interface PromptResponse<T extends TemplateValue> {
  response: TemplateResponseMap[T]
  image: string
}

class PromptResponseGenerator {
  constructor(private llm: GenAI) {}

  async generateResponse<T extends TemplateValue>({
    userInput,
    attachmentUrls,
    template,
    history,
  }: GenerateConversationParams & { template: T }): Promise<PromptResponse<T>> {
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

      Logger.info('Returning text response')
      return { response: JSON.parse(response.text), image: '' }
    } catch (error) {
      Logger.error('Error generating response: ' + error)
      return {
        response: JSON.parse(
          JSON.stringify({ error: 'Failed to generate response' })
        ) as TemplateResponseMap[T],
        image: '',
      }
    }
  }
}
