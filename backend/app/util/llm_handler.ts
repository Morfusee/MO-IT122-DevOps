import { GeminiLLM } from '#services/llms/gemini_service'

/**
 * Enum representing the different language models available.
 */
export const LLM = {
  GEMINI: GeminiLLM.create(),
}
