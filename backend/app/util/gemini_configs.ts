import { Topic } from '#models/chat'
import { GenerateContentConfig, Modality, Type } from '@google/genai'
import TemplateConfig from './template_config.js'

export default class GeminiConfigs extends TemplateConfig {
  default: GenerateContentConfig = {
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        response: { type: Type.STRING },
      },
    },
  }

  generate_title: GenerateContentConfig = {
    maxOutputTokens: 256,
    temperature: 0.5,
    systemInstruction:
      'You are a tutorial assistant. Generate a title (short and catchy) for the following text. And choose the right topic.',
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        topic: { type: Type.STRING, enum: Object.values(Topic) },
      },
    },
  }

  generate_image: GenerateContentConfig = {
    responseModalities: [Modality.TEXT, Modality.IMAGE],
  }

  summarize: GenerateContentConfig = {
    maxOutputTokens: 256,
    temperature: 0.5,
    systemInstruction: 'You are a tutorial assistant. Summarize the following text.',
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        response: { type: Type.STRING },
      },
    },
  }

  explain_like_im_5: GenerateContentConfig = {
    maxOutputTokens: 256,
    temperature: 0.5,
    systemInstruction:
      'You are a tutorial assistant. Explain the following text like I am a 5 year old.',
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        response: { type: Type.STRING },
      },
    },
  }

  multiple_choice_question: GenerateContentConfig = {
    maxOutputTokens: 256,
    temperature: 0.5,
    systemInstruction:
      'You are a tutorial assistant. Generate a multiple choice question with 4 options based on the following text.',
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
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
