import type { HttpContext } from '@adonisjs/core/http'

import { LLM } from '#services/llm_service'
import { inject } from '@adonisjs/core'
import { promptValidator } from '#validators/llm'
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@foadonis/openapi/decorators'
import MessagePairModel from '#models/message_pair'
import PromptService from '#services/prompt_service'
import { MessagePrompt, MessagePair } from '../schemas/message_pair.js'

export default class MessagePairController {
  @ApiOperation({ summary: 'Create a message pair in the chat' })
  @ApiParam({
    name: 'chatId',
    type: 'number',
    required: true,
    description: 'The ID of the chat to attach this message to',
  })
  @ApiBody({ type: MessagePrompt })
  @ApiResponse({
    status: 200,
    description: 'Message Pair created successfully',
    type: MessagePair,
  })
  @inject()
  async index({ request, response }: HttpContext) {
    const { attachmentUrls, templateId } = request.body()

    // TODO: Uncomment when chat is implemented
    // const chat = await ChatModel.findOrFail(request.param('chatId'))
    // if (!chat) return response.notFound({ message: 'Chat not found' })

    // TODO: Uncomment when templates are implemented
    // const template = templateId ? await TemplateModel.findById(templateId).select('prompt') : null

    // TODO: Add switching to other LLM
    const promptService = PromptService.build(LLM.GEMINI)

    const { prompt } = await request.validateUsing(promptValidator)

    const ai = await promptService.generateResponse(prompt, attachmentUrls, templateId)

    const messagePair = await MessagePairModel.create({
      prompt,
      response: {
        text: ai.response.text,
        image: '',
      },
      // TODO: Uncomment when templates are implemented
      // template: template,

      // TODO: Uncomment when chat is implemented
      // chat: chat,
    })

    response.ok({
      id: messagePair.id,
      prompt,
      response: messagePair.response,
      templateId: '', // TODO: Add template when implemented
      chatId: '', // TODO: Add chat when implemented
    })
  }
}
