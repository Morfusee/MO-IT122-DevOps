import ChatModel, { Topic } from '#models/chat'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import { Types } from 'mongoose'
import { Chat } from '../schemas/chat.js'
import PromptService from '#services/prompt_service'
import { LLM } from '#services/llm_service'

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

  async store({ request, response }: HttpContext) {
    // Get userId from request.auth
    const userId = request.auth.user?.userId

    // Get user prompt from request.body()
    const { prompt } = request.body()

    if (!userId || !prompt) {
      return response.badRequest({ error: 'Missing userId or prompt' })
    }

    // Use PromptService to generate chat name
    const promptService = PromptService.build(LLM.GEMINI)

    // Prompt to generate chat name and topic
    const nameAndTopicPrompt = `You are an AI that generates a chat title and topic based on the user's message.
    User message:
    "${prompt}"

    Respond with only two lines without -:
    - First line: The chat title (short and catchy).
    - Second line: The topic (one of: math, science, english, filipino).
    Do not include anything else. Just the title and the topic.`

    const ai = await promptService.generateResponse(nameAndTopicPrompt)

    let name = 'Untitled Chat'
    let topic: Topic = Topic.English

    try {
      const [titleLine, topicLine] = ai.response.text!.split('\n').map((line) => line.trim())

      if (titleLine) {
        name = titleLine
      }
      if (topicLine && ['math', 'science', 'english', 'filipino'].includes(topicLine)) {
        topic = topicLine as Topic
      }
    } catch (err) {
      console.warn('Failed to parse AI response:', err)
    }

    const chat = new ChatModel({ userId: userId, name: name, topic: topic }).save()
    return chat
  }
}
