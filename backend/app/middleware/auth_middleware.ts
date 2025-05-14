import { appKey } from '#config/app'
import UserModel from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'

export default class AuthMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const token = request.plainCookie('accessToken', { encoded: false })

    if (!token) {
      return response.unauthorized({ message: 'Token not found' })
    }

    try {
      const payload = jwt.verify(token, appKey.release()) as { userId: string }

      const user = await UserModel.findById(payload.userId)
      if (!user) {
        return response.unauthorized({ message: 'User not found' })
      }

      request.auth = { user: { userId: payload.userId } }

      await next()
    } catch (err) {
      console.log(err)
      response.unauthorized({ message: 'Invalid or expired token' })
    }
  }
}
