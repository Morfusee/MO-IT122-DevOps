import ChatModel from '#models/chat'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@foadonis/openapi/decorators'
import { Types } from 'mongoose'
import { Chat, NewChat } from '../schemas/chat.js'
import PromptService from '#services/prompt_service'
import MessagePairModel, { Template } from '#models/message_pair'
import { inject } from '@adonisjs/core'
import { MessagePrompt } from '../schemas/message_pair.js'
import { LLM } from '../util/llm_handler.js'
import FileUploads from '../util/file_uploads.js'
import EnumUtil from '../util/enum_util.js'
import Logger from '@adonisjs/core/services/logger'
import Mappers from '../util/mappers.js'

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
   * @param {HttpContext} context - The HTTP context containing request and response
   * @param {Object} context.request - The request object containing authentication data
   * @returns {Promise<Array<Chat>>} A list of chat sessions belonging to the authenticated user
   */
  @ApiOperation({
    summary: 'Retrieve all chats for the authenticated user',
    description:
      'Fetches and returns a list of all chat entries that belong to the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all chats associated with the authenticated user.',
    type: [Chat],
  })
  async index({ request }: HttpContext) {
    const id = request.auth.user?.userId

    return ChatModel.find({ userId: id }).sort({ updatedAt: -1 })
  }

  /**
   * Retrieves details of a specific chat session by its ID.
   *
   * This method validates the chat ID, fetches the chat from the database,
   * and returns it if found. If the ID is invalid or the chat doesn't exist,
   * it returns an appropriate error response.
   *
   * @param {HttpContext} context - The HTTP context containing request and response
   * @param {Object} context.params - The route parameters containing the chat ID
   * @param {Object} context.response - The response object for sending HTTP responses
   * @returns {Promise<Chat|Object>} The requested chat details or an error response
   * @throws {Error} If the chat ID is invalid (400 Bad Request) or the chat is not found (404 Not Found)
   */
  @ApiOperation({
    summary: 'Get details of a specific chat by Id',
    description:
      'Retrieves a single chat based on the provided chatId, if it belongs to the authenticated user and the ID is valid.',
  })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the requested chat details.',
    type: Chat,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid chat ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
  })
  async show({ params, response }: HttpContext) {
    const chatId = params.id

    if (!chatId || !Types.ObjectId.isValid(chatId)) return response.badRequest('Invalid chatId')

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
   * @param {HttpContext} context - The HTTP context containing request, response, and params
   * @param {Object} context.request - The request object containing the updated chat name
   * @param {Object} context.response - The response object for sending HTTP responses
   * @param {Object} context.params - The route parameters containing the chat ID
   * @returns {Promise<Chat|Object>} The updated chat details or an error response
   * @throws {Error} If the chat ID is invalid (400 Bad Request), the name is missing (400 Bad Request),
   *                 or the chat is not found (404 Not Found)
   */
  @ApiOperation({
    summary: 'Update the name of an existing chat by ID',
    description:
      'Updates only the name of an existing chat using the provided chatId. Only the `name` field will be modified.',
  })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the chat name',
    type: Chat,
  })
  @ApiResponse({
    status: 400,
    description: 'Name field is required or invalid chatId',
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
  })
  async update({ request, response, params }: HttpContext) {
    const chatId = params.chatId

    if (!chatId || !Types.ObjectId.isValid(chatId)) return response.badRequest('Invalid chatId')

    const { name } = request.body()

    if (!name) return response.badRequest('Name field is required')

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
   * @param {HttpContext} context - The HTTP context containing params and response
   * @param {Object} context.params - The route parameters containing the chat ID
   * @param {Object} context.response - The response object for sending HTTP responses
   * @returns {Promise<Object>} A success message or an error response
   * @throws {Error} If the chat is not found (404 Not Found)
   */
  @ApiOperation({
    summary: 'Delete a chat by ID',
    description:
      'Deletes a specific chat identified by the provided chatId. This action is irreversible.',
  })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the chat',
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
  })
  async destroy({ params, response }: HttpContext) {
    const chatId = params.chatId

    const deleted = await ChatModel.findByIdAndDelete(chatId)

    if (!deleted) return response.notFound('Chat not found')

    return { message: 'Chat deleted successfully' }
  }

  /**
   * Creates a new chat session based on a user prompt.
   *
   * This method processes the user's prompt, generates a title and topic using AI,
   * creates a new chat record, generates an AI response to the prompt, and stores
   * the message pair. It handles various error cases including missing data and
   * AI generation failures.
   *
   * @param {HttpContext} context - The HTTP context containing request and response
   * @param {Request} context.request - The request object containing the user prompt and other data
   * @param {Response} context.response - The response object for sending HTTP responses
   * @param {PromptService} promptService - The service for generating AI responses (injected)
   * @returns {Promise<Object>} The created chat and message pair or an error response
   * @throws {Error} If userId or prompt is missing (400 Bad Request) or if there's an internal error (500 Internal Server Error)
   */
  @ApiOperation({
    summary: 'Create a new chat based on user prompt',
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
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error or AI generation failure',
  })
  @inject()
  async store({ request, response }: HttpContext, promptService: PromptService) {
    const { attachmentUrls, template } = request.body()
    const templateType: Template = EnumUtil.getTemplateFromString(template)

    // Get userId from request.auth
    const userId = request.auth.user?.userId

    // Get user prompt from request.body()
    const { prompt: userPrompt } = request.body()

    if (!userId || !userPrompt) {
      Logger.error('Missing userId or prompt')
      return response.badRequest({ error: 'Missing userId or prompt' })
    }

    const titleGenerator = await promptService.build(LLM.GEMINI).generateResponse({
      userInput: userPrompt,
      template: Template.GENERATE_TITLE,
    })

    Logger.info('AI response: ' + JSON.stringify(titleGenerator.response))

    const raw = titleGenerator.response

    const chatMetaData: (JSON & ChatMetaData) | null = isChatMetaData(raw) ? raw : null

    if (!chatMetaData) {
      Logger.error('Failed to generate chat metadata')
      return response.internalServerError({ error: 'Failed to generate chat metadata' })
    }

    const chat = await ChatModel.create({
      userId: userId,
      ...chatMetaData,
    })

    if (!chat) {
      Logger.error('Failed to create chat')
      return response.internalServerError({ error: 'Failed to create chat' })
    }

    const message = await promptService.build().generateResponse({
      userInput: userPrompt,
      attachmentUrls: attachmentUrls,
      template: templateType,
    })

    const imagePath =
      templateType === Template.GENERATE_IMAGE
        ? await FileUploads.uploadImage(message.image, 'base64')
        : ''

    const messagePair = await MessagePairModel.create({
      prompt: userPrompt,
      json_response: message.response,
      image: imagePath || '',
      template: templateType,
      chat: chat,
    })

    return response.created(Mappers.toNewChatResponse(chat, messagePair))
  }
}

/**
 * Type guard function to check if an object conforms to the ChatMetaData interface.
 *
 * This function validates that the provided object has the required properties
 * with the correct types to be considered valid ChatMetaData.
 *
 * @param {any} obj - The object to check
 * @returns {boolean} True if the object is valid ChatMetaData, false otherwise
 */
function isChatMetaData(obj: any): obj is ChatMetaData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.title === 'string' &&
    typeof obj.topic === 'string'
  )
}

/**
 * Interface representing metadata for a chat session.
 *
 * This interface defines the structure of metadata that is generated
 * for a chat session, including a title and topic.
 *
 * @interface ChatMetaData
 * @property {string} title - The title of the chat session
 * @property {string} topic - The topic or category of the chat session
 */
interface ChatMetaData {
  title: string
  topic: string
}
