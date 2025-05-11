import env from '#start/env'
import { inject } from '@adonisjs/core'
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai'

export enum LLM {
  GEMINI,
}

@inject()
export default class LLMService {
  static LLM: any
  gemini() {
    return new GoogleGenAI({ apiKey: env.get('GEMINI_KEY') })
  }

  constructor(private llm: LLM) {}
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
  async invoke(prompt: string, attachmentUrls: string[]) {
    switch (this.llm) {
      case LLM.GEMINI:
        const attachments = await Promise.all(
          attachmentUrls.map((file) =>
            this.client().files.upload({
              file: file,
            })
          )
        )

        const response = await this.client().models.generateContent({
          model: 'gemini-2.0-flash',
          contents: createUserContent([
            prompt,
            ...attachments.map((attachment) =>
              createPartFromUri(attachment.uri ?? '', attachment.mimeType ?? '')
            ),
          ]),
        })

        return {
          response: response,
        }
    }
  }
}
