import ChatModel from '#models/chat'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@foadonis/openapi/decorators'
import { Types } from 'mongoose'
import { Chat, DeleteChat, EditChat, NewChat } from '../schemas/chat.js'
import PromptService from '#services/prompt_service'
import MessagePairModel from '#models/message_pair'
import { inject } from '@adonisjs/core'
import { MessagePrompt } from '../schemas/message_pair.js'
import { Template, TemplateValue } from '#services/template_config'
import { chatIdValidator, createChatValidator, editNameValidator } from '#validators/chat'
import { Error } from '../schemas/response.js'

/**
 * ChatController handles operations related to chat sessions in the AI tutoring platform.
 *
 * This controller provides endpoints for creating, retrieving, updating, and deleting
 * chat sessions. It also handles the generation of AI responses to user prompts and
 * manages the storage of chat history.
 */
export default class ChatController {
  /**
   * Retrieves all chat sessions for the currently authenticated user.
   *
   * This method fetches all chat entries from the database that belong to the
   * authenticated user and returns them sorted by most recently updated first.
   *
   */
  @ApiOperation({
    description:
      'Fetches and returns a list of all chat entries that belong to the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all chats associated with the authenticated user.',
    type: [Chat],
  })
  async index({ response, request }: HttpContext) {
    const id = request.auth.user?.userId

    const chats = await ChatModel.find({ userId: id }).sort({ updatedAt: -1 })

    return response.ok(chats)
  }

  /**
   * Retrieves details of a specific chat session by its ID.
   *
   * This method validates the chat ID, fetches the chat from the database,
   * and returns it if found. If the ID is invalid or the chat doesn't exist,
   * it returns an appropriate error response.
   *
   */
  @ApiOperation({
    description:
      'Retrieves a single chat based on the provided chatId, if it belongs to the authenticated user and the ID is valid.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the chat',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the requested chat details.',
    type: Chat,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid chat ID format',
    type: Error,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
    type: Error,
  })
  async show({ request, response }: HttpContext) {
    const { params } = await request.validateUsing(chatIdValidator)
    const chatId = params.id

    if (!Types.ObjectId.isValid(chatId)) return response.badRequest('Invalid chatId')

    const chat = await ChatModel.findById(chatId)

    if (!chat) return response.notFound('Chat not found')

    return chat
  }

  /**
   * Updates the name of an existing chat session.
   *
   * This method validates the chat ID, checks if the name field is provided,
   * updates the chat in the database, and returns the updated chat if successful.
   * If the ID is invalid, the name is missing, or the chat doesn't exist,
   * it returns an appropriate error response.
   *
   */
  @ApiOperation({
    description:
      'Updates only the name of an existing chat using the provided chatId. Only the `name` field will be modified.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the chat',
    type: String,
  })
  @ApiBody({ type: EditChat })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the chat name',
    type: Chat,
  })
  @ApiResponse({
    status: 400,
    description: 'Name field is required or invalid chatId',
    type: Error,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
    type: Error,
  })
  async update({ request, response }: HttpContext) {
    const { params, name } = await request.validateUsing(editNameValidator)
    const chatId = params.id

    if (!chatId || !Types.ObjectId.isValid(chatId)) return response.badRequest('Invalid chatId')

    const updated = await ChatModel.findByIdAndUpdate(chatId, { name }, { new: true })

    if (!updated) return response.notFound('Chat not found')

    return updated
  }

  /**
   * Deletes a chat session by its ID.
   *
   * This method finds and deletes a chat session from the database based on the provided ID.
   * If the chat is successfully deleted, it returns a success message. If the chat doesn't exist,
   * it returns a not found error response.
   *
   */
  @ApiOperation({
    description:
      'Deletes a specific chat identified by the provided chatId. This action is irreversible.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the chat',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the chat',
    type: DeleteChat,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
    type: Error,
  })
  async destroy({ request, response }: HttpContext) {
    const { params } = await request.validateUsing(chatIdValidator)
    const chatId = params.id

    const deleted = await ChatModel.findByIdAndDelete(chatId)

    if (!deleted) return response.notFound('Chat not found')

    return { message: 'Chat deleted successfully' }
  }

  /**
   * Creates a new chat session based on a user prompt.
   *
   * This method processes the user's prompt, generates a chat title and topic using AI,
   * creates a new chat record, generates an AI response to the prompt, and stores
   * the message pair. It handles various error cases including missing data and
   * AI generation failures.
   *
   */
  @ApiOperation({
    description: `Generates a new chat using an AI model based on the user's prompt. Returns the created chat.`,
  })
  @ApiBody({ type: MessagePrompt })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new chat based on the user prompt',
    type: NewChat,
  })
  @ApiResponse({
    status: 400,
    description: 'Missing userId or prompt in request',
    type: Error,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error or AI generation failure',
    type: Error,
  })
  @inject()
  async store({ request, response, logger }: HttpContext, promptService: PromptService) {
    const { prompt, attachmentUrls, template } = await request.validateUsing(createChatValidator)
    const templateType: TemplateValue = template || Template.TUTOR

    // Get userId from request.auth
    const userId = request.auth.user?.userId

    // Get user prompt from request.body()
    const userPrompt = prompt

    if (!userId) {
      logger.error('Missing userId or prompt')
      return response.badRequest({ error: 'Missing userId or prompt' })
    }

    const chatMetaDataGenerator = await promptService.build().generateResponse({
      userInput: userPrompt,
      template: Template.GENERATE_TITLE,
    })

    logger.info('AI response: ' + JSON.stringify(chatMetaDataGenerator.response))

    const chatMetaData = chatMetaDataGenerator.response

    if (!chatMetaData) {
      logger.error('Failed to generate chat metadata')
      return response.internalServerError({ error: 'Failed to generate chat metadata' })
    }

    const chat = await ChatModel.create({
      userId: userId,
      ...chatMetaData,
    })

    if (!chat) {
      logger.error('Failed to create chat')
      return response.internalServerError({ error: 'Failed to create chat' })
    }

    const message = await promptService.build().generateResponse({
      userInput: userPrompt,
      attachmentUrls: attachmentUrls,
      template: templateType,
    })

    //upload images

    const messagePair = await MessagePairModel.create({
      prompt: userPrompt,
      json_response: message.response,
      image: '',
      template: templateType,
      chat: chat,
    })

    return response.created({
      chat: {
        chatId: chat.id,
        ...chat.toJSON(),
      },
      messagePair: {
        chatId: chat.id,
        ...messagePair.toJSON(),
      },
    })
  }
}
