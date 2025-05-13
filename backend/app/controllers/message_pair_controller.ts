import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { idValidator, promptValidator } from '#validators/llm'
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@foadonis/openapi/decorators'
import MessagePairModel, { Template } from '#models/message_pair'
import PromptService, { ConversationHistory } from '#services/prompt_service'
import { MessagePrompt, MessagePair } from '../schemas/message_pair.js'
import { Error } from '../schemas/response.js'
import ChatModel from '#models/chat'
import EnumUtil from '../util/enum_util.js'
import FileUploads from '../util/file_uploads.js'

export default class MessagePairController {
  // ---------- CREATE MESSAGE PAIR IN CHAT (STORE) ----------
  @ApiOperation({ summary: 'Create a message pair in the chat' })
  @ApiParam({
    name: 'chat_Id',
    required: true,
    description: 'The ID of the chat to attach this message to',
    type: String,
  })
  @ApiBody({ type: MessagePrompt })
  @ApiResponse({
    status: 201,
    description: 'Message Pair created successfully',
    type: MessagePair,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
    type: Error,
  })
  @inject()
  async store({ params, request, response }: HttpContext, promptService: PromptService) {
    const { attachmentUrls, template } = request.body()
    const { prompt } = await request.validateUsing(promptValidator)

    let chat = await ChatModel.findById(request.param('chat_id'))
    if (!chat) chat = await ChatModel.findById(params.chat_id)
    if (!chat) return response.notFound({ message: 'Chat not found' })

    const templateType: Template = EnumUtil.getTemplateFromString(template)

    const messages = await MessagePairModel.find({ chat: params.chat_id })
      .sort({ createdAt: 1 })
      .lean()

    const history: ConversationHistory[] = messages.map((msg) => {
      return {
        prompt: msg.prompt,
        response: JSON.stringify(msg.json_response),
      }
    })

    const ai = await promptService.build().generateResponse({
      userInput: prompt,
      attachmentUrls: attachmentUrls,
      template: templateType,
      history: history,
    })

    if (!ai) return response.badRequest({ message: 'Failed to generate response' })

    // Decode base64 image and save to file (if exists)
    const imagePath = await FileUploads.uploadImage(ai.image, 'base64')

    const messagePair = await MessagePairModel.create({
      prompt,
      json_response: ai.response,
      image: imagePath || '',
      template: templateType,
      chat: chat,
    })

    if (!messagePair) return response.badRequest({ message: 'Failed to create message pair' })

    response.created(messagePair)
  }

  // ---------------- RETRIEVE MESSAGE PAIRS IN CHAT (INDEX) ----------------
  @ApiOperation({ summary: 'Retrieve all message pairs in the chat' })
  @ApiParam({
    name: 'chat_id',
    required: true,
    description: 'The ID of the chat to retrieve message pairs from',
    type: String,
  })
  @ApiBody({ type: MessagePrompt })
  @ApiResponse({
    status: 200,
    description: 'Message Pairs retrieved successfully',
    type: [MessagePair],
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
    type: Error,
  })
  @inject()
  async index({ request, response }: HttpContext) {
    const { params } = await request.validateUsing(idValidator)

    const chat = await ChatModel.findById(params.chat_id)
    if (!chat) return response.notFound({ message: 'Chat not found' })

    const messagePairs = await MessagePairModel.find({ chat: chat }).sort({ createdAt: 1 })

    if (!messagePairs) return response.notFound({ message: 'Message pairs not found' })

    response.ok(messagePairs) // TODO: Add pagination
  }
}
