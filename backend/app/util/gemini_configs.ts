import { Topic } from '#models/chat'
import { GenerateContentConfig, Modality, Type } from '@google/genai'
import TemplateConfig, { AI_TUTOR_INSTRUCTION } from './template_config.js'

export default class GeminiConfigs extends TemplateConfig {
  default: GenerateContentConfig = {
    maxOutputTokens: 1024,
    temperature: 0.7,
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        response: { type: Type.STRING },
      },
    },
  }

  generate_title: GenerateContentConfig = {
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
  }

  generate_image: GenerateContentConfig = {
    maxOutputTokens: 2048,
    temperature: 0.9,
    responseModalities: [Modality.TEXT, Modality.IMAGE],
  }

  tutor: GenerateContentConfig = {
    systemInstruction: AI_TUTOR_INSTRUCTION,
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        response: { type: Type.STRING },
      },
    },
  }

  summarize: GenerateContentConfig = {
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
  }

  explain_like_im_5: GenerateContentConfig = {
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
  }

  multiple_choice_question: GenerateContentConfig = {
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
  }

  static build() {
    return new GeminiConfigs()
  }
}
