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
