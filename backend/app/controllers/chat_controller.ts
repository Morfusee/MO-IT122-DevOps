import ChatModel, { Topic } from '#models/chat'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@foadonis/openapi/decorators'
import { Types } from 'mongoose'
import { Chat, NewChat, NewChatPrompt } from '../schemas/chat.js'
import { GoogleGenAI, Type } from '@google/genai'
import env from '#start/env'
import PromptService from '#services/prompt_service'
import { AI_TUTOR_INSTRUCTION } from '#services/prompts'
import MessagePairModel from '#models/message_pair'
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

    const chats = await ChatModel.find({ userId: id }).sort({ updatedAt: -1 })

    return chats
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
  @ApiResponse({
    status: 200,
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
    // Get userId from request.auth
    const userId = request.auth.user?.userId

    // Get user prompt from request.body()
    const { prompt: userPrompt } = request.body()

    if (!userId || !userPrompt) {
      return response.badRequest({ error: 'Missing userId or prompt' })
    }

    // Prompt to generate chat name and topic
    const prompt = `You are an AI that generates a chat title and topic based on the user's message.
    User message:
    "${userPrompt}"

    Respond with the chat title (short and catchy) and the topic (one of: math, science, english, filipino).`

    const GEMINI_KEY = env.get('GEMINI_KEY')
    const ai = new GoogleGenAI({ apiKey: GEMINI_KEY })

    const promptResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            topic: { type: Type.STRING, enum: Object.values(Topic) },
          },
          propertyOrdering: ['name', 'topic'],
        },
      },
    })

    const parsedData = JSON.parse(promptResponse.text!)

    const chat = await ChatModel.create({
      userId: userId,
      name: parsedData.name,
      topic: parsedData.topic,
    })

    const message = await promptService.build().generateResponse({
      userInput: userPrompt,
      instruction: AI_TUTOR_INSTRUCTION,
    })

    const messagePair = await MessagePairModel.create({
      chat: chat.id,
      prompt: userPrompt,
      response: [{ text: message.response }],
    })

    return {
      chat,
      messagePair,
    }
  }
}
