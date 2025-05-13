import env from '#start/env'
import { inject } from '@adonisjs/core'
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai'
import GeminiConfigs from '../util/gemini_configs.js'
import Logger from '@adonisjs/core/services/logger'
import { Template } from '#models/message_pair'

/**
 * Enum representing the different language models available.
 */
export enum LLM {
  GEMINI,
}

/**
 * The LLMService class is responsible for interacting with different language models.
 */
@inject()
export default class LLMService {
  /**
   * Constructor for the LLMService.
   * @param {LLM} llm - The language model to use.
   */
  constructor(private llm: LLM) {}

  /**
   * Returns a client instance for interacting with the Gemini language model.
   * @returns {GoogleGenAI} A new instance of the GoogleGenAI client.
   */
  gemini() {
    return new GoogleGenAI({ apiKey: env.get('GEMINI_KEY') })
  }

  /**
   * Returns a client instance for the current language model.
   * Throws an error if the language model is not supported.
   * @returns {any} A new instance of the AI language client.
   * @throws Will throw an error if the LLM is not supported.
   */
  client() {
    switch (this.llm) {
      case LLM.GEMINI:
        return new GoogleGenAI({ apiKey: env.get('GEMINI_KEY') })
      default:
        throw new Error('LLM not supported')
    }
  }

  /**
   * Invoke the LLM with a given prompt and optional attachment URLs. Returns an object with a "response" property containing the output of the LLM.
   * @param {string} prompt The prompt to give to the LLM.
   * @param {string[]} attachmentUrls URLs of files to use as attachments to the prompt.
   * @returns {Promise<{ response: string }>} A promise that resolves with an object containing the LLM's response.
   */
  async invoke(prompt: string, template: Template, attachmentUrls: string[]): Promise<LLMResponse> {
    switch (this.llm) {
      case LLM.GEMINI:
        // Create attachments from the given URLs.
        const attachments = await Promise.all(
          attachmentUrls.map(
            // For each URL, upload the file to the Gemini service.
            (image) =>
              this.client().files.upload({
                file: image,
              })
          )
        )

        // Use the model according to the template, or the default if none is specified.
        const geminiModel =
          template === Template.GENERATE_IMAGE
            ? 'gemini-2.0-flash-preview-image-generation'
            : 'gemini-2.0-flash'

        // Create the content to send to the model.
        const content = createUserContent([
          // Add the prompt to the content.
          prompt,
          // Add the attachments to the content.
          ...attachments.map((attachment) =>
            createPartFromUri(attachment.uri ?? '', attachment.mimeType ?? '')
          ),
        ])

        // Use the configuration specified by the template.
        const config = GeminiConfigs.build().get(template)

        // Generate content using the Gemini model.
        const response = await this.client()
          .models.generateContent({
            model: geminiModel,
            contents: content,
            config: config,
          })
          .catch((error: any) => {
            throw new Error('Failed to invoke Gemini: ' + error)
          })

        let imageBase64: string | null = null
        let imageDescription: string | null = null

        // If the template is for generating an image, process the response.
        if (template === Template.GENERATE_IMAGE && response?.candidates?.[0]?.content) {
          for (const part of response.candidates[0].content.parts ?? []) {
            if (part.text) {
              imageDescription = part.text
            } else if (part.inlineData && part.inlineData.data) {
              imageBase64 = part.inlineData.data
            }
          }
        }

        Logger.info('Generated response: ' + response.text)

        return {
          response: response.text?.trim() || '',
          image: imageBase64 || '',
        }
    }
  }
}

interface LLMResponse {
  response: string
  image: string
}
