import env from '#start/env'
import { GoogleGenAI, createUserContent, createPartFromUri, Content } from '@google/genai'

export interface TextGenParams {
  prompt: string
  attachmentUrls: string[]
  instruction: string
}

export interface ConvoGenParams {
  prompt: string
  instruction: string
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

  async textGen({ prompt, attachmentUrls, instruction }: TextGenParams) {
    const client = new GoogleGenAI({ apiKey: API_KEY })

    const attachments = await Promise.all(
      attachmentUrls.map((image) =>
        client.files.upload({
          file: image,
        })
      )
    )

    const response = await client.models.generateContent({
      model: MODEL,
      contents: createUserContent([
        prompt,
        ...attachments.map((attachment) =>
          createPartFromUri(attachment.uri ?? '', attachment.mimeType ?? '')
        ),
      ]),
      config: {
        systemInstruction: instruction,
      },
    })

    return {
      response: response.text,
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

/**
 * Enum representing the different language models available.
 */
export const LLM = {
  GEMINI: GeminiLLM.create(),
}
