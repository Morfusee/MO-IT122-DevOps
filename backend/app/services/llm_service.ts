import env from '#start/env'
import { GoogleGenAI } from '@google/genai'

export default class LLMService {
  gemini() {
    return new GoogleGenAI({ apiKey: env.get('GEMINI_KEY') })
  }
}
