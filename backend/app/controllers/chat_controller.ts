import ChatModel from '#models/chat'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiOperation, ApiParam, ApiResponse } from '@foadonis/openapi/decorators'
import { Types } from 'mongoose'
import { Chat } from '../schemas/chat.js'
import PromptService from '#services/prompt_service'
import { Template } from '#models/message_pair'
import { LLM } from '#services/llm_service'
import { inject } from '@adonisjs/core'

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

    return ChatModel.find({ userId: id }).sort({ updatedAt: -1 })
  }

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
  async show({ params, response }: HttpContext) {
    const chatId = params.id

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

  @ApiOperation({
    summary: 'Create a new chat based on user prompt',
    description: `Generates a new chat using an AI model based on the user's prompt. Returns the created chat.`,
  })
  @ApiBody({ type: NewChatPrompt })
  @ApiBody({ type: ChatRequest })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new chat based on the user prompt',
    type: Chat,
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
    // Get userId from request.auth
    const userId = request.auth.user?.userId

    // Get user prompt from request.body()
    const { prompt: userPrompt } = request.body()

    if (!userId || !userPrompt) {
      return response.badRequest({ error: 'Missing userId or prompt' })
    }

    const ai = await PromptService.build(LLM.GEMINI).generateResponse(
      userPrompt,
      Template.GENERATE_TITLE
    )

    const data = ai.response

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

    const message = await promptService.build().generateResponse({
      userInput: userPrompt,
      instruction: AI_TUTOR_INSTRUCTION,
    })

    const messagePair = await MessagePairModel.create({
      chat: chat.id,
      prompt: userPrompt,
      response: [{ text: message.response }],
    })

    return response.created({
      id: chat.id,
      messagePair,
    })
  }
}
