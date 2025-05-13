import env from '#start/env'
import GeminiConfigs from '../util/gemini_configs.js'
import Logger from '@adonisjs/core/services/logger'
import { GoogleGenAI, createUserContent, createPartFromUri, Content } from '@google/genai'
import { Template } from '#models/message_pair'

export interface TextGenParams {
  prompt: string
  attachmentUrls: string[]
  template: Template
}

export interface ConvoGenParams {
  prompt: string
  template: string
  history: Content[]
}

export interface GenAI {
  textGen(params: TextGenParams): Promise<{ response: string | undefined }>
  convoGen(params: ConvoGenParams): Promise<{ response: string | undefined }>
}

const API_KEY = env.get('GEMINI_KEY')
const MODEL = 'gemini-2.0-flash'

class GeminiLLM implements GenAI {
  static create() {
    return new GeminiLLM()
  }

  /**
   * Invoke the LLM with a given prompt and optional attachment URLs. Returns an object with a "response" property containing the output of the LLM.
   * @param {string} prompt The prompt to give to the LLM.
   * @param attachmentUrls
   * @param template
   * @returns {Promise<{ response: string }>} A promise that resolves with an object containing the LLM's response.
   */
  async textGen({ prompt, attachmentUrls, template }: TextGenParams): Promise<LLMResponse> {
    const client = new GoogleGenAI({ apiKey: API_KEY })

    // Create attachments from the given URLs.
        const attachments = await Promise.all(
          attachmentUrls.map(
            // For each URL, upload the file to the Gemini service.
            (image) =>
              client.files.upload({
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

  async convoGen({ prompt, instruction, history }: ConvoGenParams) {
    const client = new GoogleGenAI({ apiKey: API_KEY })

    const chat = client.chats.create({
      model: MODEL,
      history: history,
      config: {
        systemInstruction: instruction,
      },
    })

    const response = await chat.sendMessage({
      message: prompt,
    })

    return {
      response: response.text,
    }
  }
}

interface LLMResponse {
  response: string
  image: string
}

/**
 * Enum representing the different language models available.
 */
export const LLM = {
  GEMINI: GeminiLLM.create(),
}
