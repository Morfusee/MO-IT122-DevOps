import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { idValidator, promptValidator } from '#validators/llm'
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@foadonis/openapi/decorators'
import MessagePairModel from '#models/message_pair'
import PromptService from '#services/prompt_service'
import { MessagePrompt, MessagePair } from '../schemas/message_pair.js'
import { AI_TUTOR_INSTRUCTION } from '#services/prompts'
import { Content } from '@google/genai'

export default class MessagePairController {
  @ApiOperation({ summary: 'Create a message pair in the chat' })
  @ApiParam({
    name: 'chat_id',
    type: String,
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
  async store({ request, response }: HttpContext, promptService: PromptService) {
    const { attachmentUrls, templateId } = request.body()

    // TODO: Uncomment when chat is implemented
    // const chat = await ChatModel.findOrFail(request.param('chatId'))
    // if (!chat) return response.notFound({ message: 'Chat not found' })

    // TODO: Uncomment when templates are implemented
    // const template = templateId ? await TemplateModel.findById(templateId).select('prompt') : null

    // TODO: Add switching to other LLM

    const { prompt, params } = await request.validateUsing(promptValidator)

    const messages = await MessagePairModel.find({ chat: params.chat_id })
      .sort({ createdAt: 1 })
      .lean()

    const history: Content[] = messages.flatMap((msg) => [
      {
        role: 'user',
        parts: [{ text: msg.prompt }],
      },
      {
        role: 'model',
        parts: [{ text: msg.response[0]?.text || '' }],
      },
    ])

    const ai = await promptService.build().generateConversation({
      userInput: prompt,
      templateId,
      history: history,
      instruction: AI_TUTOR_INSTRUCTION,
    })

    const messagePair = await MessagePairModel.create({
      prompt,
      response: {
        text: ai.response,
        image: '',
      },
      // TODO: Uncomment when templates are implemented
      // template: template,

      chat: params.chat_id,
    })

    response.ok(messagePair)
    // response.ok({
    //   id: messagePair.id,
    //   prompt,
    //   response: messagePair.response,
    //   templateId: '', // TODO: Add template when implemented
    //   chatId: '', // TODO: Add chat when implemented
    // })
  }

  @ApiOperation({ summary: 'Return a list of message pairs' })
  @ApiParam({
    name: 'chat_id',
    type: String,
    required: true,
    description: 'The ID of the chat to attach this message to',
  })
  @ApiBody({ type: MessagePrompt })
  @ApiResponse({
    status: 200,
    description: 'Message Pair retrieved successfully',
    type: [MessagePair],
  })
  async index({ request, response }: HttpContext) {
    const { params } = await request.validateUsing(idValidator)

    const messages = await MessagePairModel.find({ chat: params.chat_id }).sort({ createdAt: 1 })

    response.ok(messages)
  }
}
