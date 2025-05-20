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
import Mappers from '../util/mappers.js'

/**
 * MessagePairController handles operations related to message pairs in chat sessions.
 *
 * A message pair consists of a user prompt and the AI-generated response.
 * This controller provides endpoints for creating new message pairs within a chat
 * and retrieving all message pairs for a specific chat.
 */
export default class MessagePairController {
  /**
   * Creates a new message pair in a specific chat session.
   *
   * This method takes a user prompt, generates an AI response using the prompt service,
   * and creates a new message pair in the specified chat. It handles various template types,
   * including image generation, and maintains conversation history for context-aware responses.
   *
   * @param {HttpContext} context - The HTTP context containing params, request, and response
   * @param {Object} context.params - The route parameters containing the chat ID
   * @param {Object} context.request - The request object containing the prompt and other data
   * @param {Object} context.response - The response object for sending HTTP responses
   * @param {PromptService} promptService - The service for generating AI responses (injected)
   * @returns {Promise<MessagePair>} The created message pair or an error response
   * @throws {Error} If the chat is not found (404 Not Found) or if there's an error in creating the message pair (400 Bad Request)
   */
  @ApiOperation({ summary: 'Create a message pair in the chat' })
  @ApiParam({
    name: 'chat_id',
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
  @ApiResponse({
    status: 400,
    description: 'Failed to generate response or create message pair',
    type: Error,
  })
  @inject()
  async store({ params, request, response }: HttpContext, promptService: PromptService) {
    const { attachmentUrls, template } = request.body()
    const { prompt } = await request.validateUsing(promptValidator)

    let chat = await ChatModel.findById(request.param('chat_id'))
    if (!chat) chat = await ChatModel.findById(params.chat_id)
    if (!chat) return response.notFound({ message: 'Chat not found' })

    const templateType: Template = template
      ? EnumUtil.getTemplateFromString(template)
      : Template.TUTOR

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
    const imagePath =
      templateType === Template.GENERATE_IMAGE
        ? await FileUploads.uploadImage(ai.image, 'base64')
        : ''

    const messagePair = await MessagePairModel.create({
      prompt,
      json_response: ai.response,
      image: imagePath || '',
      template: templateType,
      chat: chat,
    })

    if (!messagePair) return response.badRequest({ message: 'Failed to create message pair' })

    response.created(Mappers.toMessagePairResponse(messagePair))
  }

  /**
   * Retrieves all message pairs for a specific chat session.
   *
   * This method fetches all message pairs from the database that belong to the
   * specified chat and returns them sorted by creation time (oldest first).
   *
   * @param {HttpContext} context - The HTTP context containing request and response
   * @param {Object} context.request - The request object containing the validated chat ID
   * @param {Object} context.response - The response object for sending HTTP responses
   * @returns {Promise<Array<MessagePair>>} A list of message pairs belonging to the specified chat
   * @throws {Error} If the chat is not found (404 Not Found) or if message pairs are not found (404 Not Found)
   */
  @ApiOperation({ summary: 'Retrieve all message pairs in the chat' })
  @ApiParam({
    name: 'chat_id',
    required: true,
    description: 'The ID of the chat to retrieve message pairs from',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Message Pairs retrieved successfully',
    type: [MessagePair],
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found or message pairs not found',
    type: Error,
  })
  @inject()
  async index({ request, response }: HttpContext) {
    const { params } = await request.validateUsing(idValidator)

    const chat = await ChatModel.findById(params.chat_id)
    if (!chat) return response.notFound({ message: 'Chat not found' })

    const messagePairs = await MessagePairModel.find({ chat: chat }).sort({ createdAt: 1 })

    if (!messagePairs) return response.notFound({ message: 'Message pairs not found' })

    const formattedMessagePairs = messagePairs.map((msg) => Mappers.toMessagePairResponse(msg))

    response.ok(formattedMessagePairs) // TODO: Add pagination
  }
}
