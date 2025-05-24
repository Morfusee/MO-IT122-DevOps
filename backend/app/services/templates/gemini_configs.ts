import { Topic } from '#models/chat'
import { AI_TUTOR_INSTRUCTION } from '#services/prompt_instructions'
import { TemplateConfigType } from '#services/template_config'
import { GenerateContentConfig, Type } from '@google/genai'

export const GeminiConfig: TemplateConfigType<GenerateContentConfig> = {
  default: {
    maxOutputTokens: 1024,
    temperature: 0.7,
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        response: { type: Type.STRING },
      },
    },
  },

  generate_title: {
    maxOutputTokens: 128,
    temperature: 0.8,
    systemInstruction:
      AI_TUTOR_INSTRUCTION +
      'For this task you are expected to generate a title / name (short and catchy) for the following text. And choose the right topic.',
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        topic: { type: Type.STRING, enum: Object.values(Topic) },
      },
    },
  },

  tutor: {
    systemInstruction: AI_TUTOR_INSTRUCTION,
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        response: { type: Type.STRING },
      },
    },
  },

  summarize: {
    maxOutputTokens: 512,
    temperature: 0.3,
    systemInstruction:
      AI_TUTOR_INSTRUCTION + 'For this task you are expected to summarize the following text.',
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        response: { type: Type.STRING },
      },
    },
  },

  explain_like_im_5: {
    maxOutputTokens: 512,
    temperature: 0.2,
    systemInstruction:
      AI_TUTOR_INSTRUCTION +
      'For this task you are expected to explain the following text like I am a 5 year old.',
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        response: { type: Type.STRING },
      },
    },
  },

  multiple_choice_question: {
    maxOutputTokens: 1024,
    temperature: 0.4,
    systemInstruction:
      AI_TUTOR_INSTRUCTION +
      'For this task you are expected to generate a multiple choice question with 4 options based on the following text.',
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          response: { type: Type.STRING },
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
  },
}
