import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { promptValidator } from '#validators/llm'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import { GeminiPromptSample, GeminiResponseSample } from '../schemas/llm.js'
import PromptService from '#services/prompt_service'
import { Template } from '#services/template_config'

export default class GeminiSamplesController {
  @ApiOperation({ summary: 'Ask gemini a question' })
  @ApiBody({ type: GeminiPromptSample })
  @ApiResponse({
    status: 200,
    description: 'Registration successful',
    type: GeminiResponseSample,
  })
  @inject()
  async index({ request, response }: HttpContext, ai: PromptService) {
    const { prompt } = await request.validateUsing(promptValidator)

    const geminiResponse = await ai
      .build()
      .generateResponse({ userInput: prompt, template: Template.DEFAULT })

    response.ok({ prompt: geminiResponse })
  }
}
