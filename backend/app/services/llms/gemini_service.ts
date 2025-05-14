import env from '#start/env'
import { Content, createPartFromUri, GoogleGenAI } from '@google/genai'
import { Template } from '#models/message_pair'
import Logger from '@adonisjs/core/services/logger'
import { ConvoGenParams, GenAI, LLMResponse } from '#services/llm_service'
import GeminiConfigs from '../../util/gemini_configs.js'

const API_KEY = env.get('GEMINI_KEY')
const BASE_MODEL = 'gemini-2.0-flash'
const IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation'

export class GeminiLLM implements GenAI {
  templateConfig = GeminiConfigs.build()

  /**
   * Invoke the LLM with a given prompt and optional attachment URLs. Returns an object with a "response" property containing the output of the LLM.
   * @param {string} prompt The prompt to give to the LLM.
   * @param attachmentUrls
   * @param template
   * @param history
   * @returns {Promise<{ response: string }>} A promise that resolves with an object containing the LLM's response.
   */
  async invoke({
    prompt,
    attachmentUrls,
    template,
    history,
  }: ConvoGenParams): Promise<LLMResponse> {
    const client = new GoogleGenAI({ apiKey: API_KEY })

    Logger.info('Invoking Gemini LLM...')
    // Create attachments from the given URLs.
    const attachments = await Promise.all(
      attachmentUrls.map(async (url) => {
        if (!url || url === '') {
          return null
        }

        try {
          Logger.info('Fetching file from URL' + { url })
          return await client.files.upload({ file: url })
        } catch (err) {
          console.error(`Error fetching or uploading file from URL: ${url}`, err)
          return null
        }
      })
    )

    const validAttachments = attachments.filter((file) => file !== null)

    // Use the model according to the template, or the default if none is specified.
    const geminiModel = template === Template.GENERATE_IMAGE ? IMAGE_MODEL : BASE_MODEL

    // Convert the history into a Gemini history.
    let geminiHistory: Content[] = []
    if (history) {
      history.flatMap((item) => {
        return [
          {
            role: 'user',
            parts: [{ text: item.prompt || '' }],
          },
          {
            role: 'model',
            parts: [{ text: item.response || '' }],
          },
        ]
      })
    }

    // Use the configuration specified by the template.
    const config = this.templateConfig.get(template)

    // Generate chat using the Gemini model.
    const chat = client.chats.create({
      model: geminiModel,
      history: geminiHistory,
      config: config,
    })

    // Send the prompt and attachments to the chat.
    const response = await chat
      .sendMessage({
        message: [
          // Add the prompt to the content.
          prompt,
          // Add the attachments to the content.
          ...validAttachments.map((attachment) =>
            createPartFromUri(attachment.uri ?? '', attachment.mimeType ?? '')
          ),
        ],
      })
      .catch((error) => {
        Logger.error('GEMINI_SERVICE: Error generating response: ' + error)
        return null
      })

    // If the response is null, return an empty response.
    if (!response) {
      return { text: '', image: '' }
    }

    Logger.info('Generated response: ' + response.text)

    let imageBase64: string | null = null

    // If the template is for generating an image, process the response.
    if (template === Template.GENERATE_IMAGE && response?.candidates?.[0]?.content) {
      for (const part of response.candidates[0].content.parts ?? []) {
        if (part.text) {
        } else if (part.inlineData && part.inlineData.data) {
          imageBase64 = part.inlineData.data
        }
      }
    }

    return {
      text: response.text?.trim() || '',
      image: imageBase64 || '',
    }
  }

  static create() {
    return new GeminiLLM()
  }
}
