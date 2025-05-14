import ChatModel, { Topic } from '#models/chat'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import { Types } from 'mongoose'
import { Chat, ChatRequest } from '../schemas/chat.js'
import PromptService from '#services/prompt_service'
import { LLM } from '#services/llm_service'
import { Template } from '#models/message_pair'
import Logger from '@adonisjs/core/services/logger'

export default class ChatController {
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

    const chats = await ChatModel.find({ userId: id }).sort({ updatedAt: -1 })

    return chats
  }

  @ApiOperation({
    summary: 'Get details of a specific chat by Id',
    description:
      'Retrieves a single chat based on the provided chatId, if it belongs to the authenticated user and the ID is valid.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the requested chat details.',
    type: [Chat],
  })
  async show({ params, response }: HttpContext) {
    const chatId = params.chatId

    if (!chatId || !Types.ObjectId.isValid(chatId)) return response.badRequest('Invalid chatId')

    const chat = await ChatModel.findById(chatId)

    if (!chat) return response.notFound('Chat not found')

    return chat
  }

  @ApiOperation({
    summary: 'Update the name of an existing chat by ID',
    description:
      'Updates only the name of an existing chat using the provided chatId. Only the `name` field will be modified.',
  })
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

  @ApiOperation({
    summary: 'Delete a chat by ID',
    description:
      'Deletes a specific chat identified by the provided chatId. This action is irreversible.',
  })
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

  @ApiOperation({
    summary: 'Create a new chat based on user prompt',
    description: `Generates a new chat using an AI model based on the user's prompt. Returns the created chat.`,
  })
  @ApiBody({ type: ChatRequest })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new chat based on the user prompt',
    type: Chat,
  })
  @ApiResponse({
    status: 400,
    description: 'Missing userId or prompt in request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error or AI generation failure',
  })
  async store({ request, response }: HttpContext) {
    // Get userId from request.auth
    const userId = request.auth.user?.userId

    // Get user prompt from request.body()
    const { prompt: userPrompt } = request.body()

    if (!userId || !userPrompt) {
      return response.badRequest({ error: 'Missing prompt' })
    }

    const ai = await PromptService.build(LLM.GEMINI).generateResponse(
      userPrompt,
      Template.GENERATE_TITLE
    )

    const data = ai.response as unknown as GeneratedTitle

    if (!data || !data.title || !data.topic) {
      return response.badRequest({
        error: 'AI response missing and/or invalid title or topic',
      })
    }

    const chat = await ChatModel.create({
      userId: userId,
      ...data,
    })

    if (!chat) {
      return response.internalServerError({ error: 'Failed to create chat' })
    }

    return response.created({
      id: chat.id,
      ...data,
    })
  }
}

interface GeneratedTitle {
  title: string
  topic: string
}
