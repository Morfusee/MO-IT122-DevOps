import type { HttpContext } from '@adonisjs/core/http'

import LLMService from '#services/llm_service'
import { inject } from '@adonisjs/core'
import { promptValidator } from '#validators/llm'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import { GeminiPromptSample, GeminiResponseSample } from '../schemas/llm.js'

export default class GeminiSamplesController {
  @ApiOperation({ summary: 'Ask gemini a question' })
  @ApiBody({ type: GeminiPromptSample })
  @ApiResponse({
    status: 200,
    description: 'Registration successful',
    type: GeminiResponseSample,
  })
  @inject()
  async index({ request, response }: HttpContext, api: LLMService) {
    const { prompt } = await request.validateUsing(promptValidator)

    const geminiResponse = await api.gemini().models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    })

    response.ok({ prompt: geminiResponse.text })
  }
}
