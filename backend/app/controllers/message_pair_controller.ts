import type { HttpContext } from '@adonisjs/core/http'

import { LLM } from '#services/llm_service'
import { inject } from '@adonisjs/core'
import { promptValidator } from '#validators/llm'
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@foadonis/openapi/decorators'
import MessagePairModel, { Template } from '#models/message_pair'
import PromptService from '#services/prompt_service'
import { MessagePrompt, MessagePair } from '../schemas/message_pair.js'
import { Error } from '../schemas/response.js'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import ChatModel from '#models/chat'
import { fileURLToPath } from 'node:url'
import Logger from '@adonisjs/core/services/logger'

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
  async store({ params, request, response }: HttpContext) {
    const { attachmentUrls, template } = request.body()
    const { prompt } = await request.validateUsing(promptValidator)

    let chat = await ChatModel.findById(request.param('chat_id'))
    if (!chat) chat = await ChatModel.findById(params.chat_id)
    if (!chat) return response.notFound({ message: 'Chat not found' })

    // TODO: Uncomment when templates are implemented
    // const template = templateId ? await TemplateModel.findById(templateId).select('prompt') : null

    const templateType =
      template && template in Template
        ? Template[template as keyof typeof Template]
        : Template.DEFAULT

    // TODO: Add switching to other LLM
    const promptService = PromptService.build(LLM.GEMINI)

    const ai = await promptService.generateResponse(prompt, templateType, attachmentUrls)
    if (!ai) return response.badRequest({ message: 'Failed to generate response' })

    // Decode base64 image and save to file (if exists)
    const base64Image = ai.image
    let imagePath: string | null = null
    if (base64Image && typeof base64Image === 'string') {
      const fileName = `${Date.now()}-ai-image.png`
      const filePath = path.join(
        dirname(fileURLToPath(import.meta.url)),
        '..',
        '..',
        'public',
        'images',
        fileName
      )

      try {
        fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'))
        imagePath = `.../public/images/${fileName}` // TODO: Make this dynamic
      } catch (error) {
        Logger.error('Failed to write image to file', error)
      }
    }

    const messagePair = await MessagePairModel.create({
      prompt,
      json_response: ai.response,
      image: imagePath,
      template: templateType,
      chat: chat,
    })

    if (!messagePair) return response.badRequest({ message: 'Failed to create message pair' })

    response.created({
      id: messagePair.id,
      prompt,
      ...ai.response,
      image: imagePath,
      template: Template.GENERATE_IMAGE,
    })
  }

  // ---------------- RETRIEVE MESSAGE PAIRS IN CHAT (INDEX) ----------------
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
    type: MessagePair,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
    type: Error,
  })
  @inject()
  async index({ params, request, response }: HttpContext) {
    let chat = await ChatModel.findById(request.param('chat_id'))
    if (!chat) chat = await ChatModel.findById(params.chat_id)
    if (!chat) return response.notFound({ message: 'Chat not found' })

    const messagePairs = await MessagePairModel.find({ chat: chat }).sort({ createdAt: -1 })

    if (!messagePairs) return response.notFound({ message: 'Message pairs not found' })

    response.ok(messagePairs) // TODO: Add pagination
  }
}
