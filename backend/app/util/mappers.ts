import { MessagePair } from '../schemas/message_pair.js'
import { Chat, NewChat } from '../schemas/chat.js'
import { User } from '../schemas/user.js'
import Logger from '@adonisjs/core/services/logger'

export default class Mappers {
  static toMessagePairResponse(messagePair: any): MessagePair {
    try {
      return {
        id: messagePair.id,
        prompt: messagePair.prompt,
        json_response: messagePair.json_response,
        image: messagePair.image,
        image_description: messagePair.image_description,
        template: messagePair.template,
        chatId: messagePair.chat,
      }
    } catch (error) {
      Logger.error('Error mapping message pair model to response')
      throw {
        message: 'Error mapping message pair model to response',
        error: error,
      }
    }
  }

  static toChatResponse(chat: any): Chat {
    try {
      return {
        id: chat.id,
        name: chat.name,
        topic: chat.topic,
        userId: chat.userId,
      }
    } catch (error) {
      Logger.error('Error mapping chat model to response')
      throw {
        message: 'Error mapping chat model to response',
        error: error,
      }
    }
  }

  static toNewChatResponse(chat: any, messagePairs: any): NewChat {
    try {
      return {
        chat: { ...Mappers.toChatResponse(chat) },
        messagePair: { ...Mappers.toMessagePairResponse(messagePairs) },
      }
    } catch (error) {
      Logger.error('Error mapping chat model to response')
      throw {
        message: 'Error mapping chat model to response',
        error: error,
      }
    }
  }

  static toUserResponse(user: any): User {
    try {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }
    } catch (error) {
      Logger.error('Error mapping user model to response')
      throw {
        message: 'Error mapping user model to response',
        error: error,
      }
    }
  }
}
