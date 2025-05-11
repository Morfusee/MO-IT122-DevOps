import env from '#start/env'
import { inject } from '@adonisjs/core'
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai'

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
  async invoke(prompt: string, attachmentUrls: string[]) {
    switch (this.llm) {
      case LLM.GEMINI:
        const attachments = await Promise.all(
          attachmentUrls.map((image) =>
            this.client().files.upload({
              file: image,
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
