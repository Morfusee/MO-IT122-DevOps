import UserModel from '#models/user'
import { authValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import jwt from 'jsonwebtoken'
import { Success, Error, AuthTokens } from '../schemas/response.js'
import { appKey } from '#config/app'
import { AuthForm } from '../schemas/auth.js'
import { User } from '../schemas/user.js'

export default class AuthController {
  @ApiOperation({ summary: 'Registers a new user' })
  @ApiBody({ type: AuthForm })
  @ApiResponse({
    status: 200,
    description: 'Registration successful',
    type: Success,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    type: Error,
  })
  async register({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(authValidator)

    const existing = await UserModel.findOne({ email })
    if (existing) {
      response.conflict({ message: 'User already exists' })
    }

    await UserModel.create({ email, passwordHash: password })

    return response.ok({ message: 'Successfully registered the user' })
  }

  @ApiOperation({ summary: 'Login an existing user' })
  @ApiBody({ type: AuthForm })
  @ApiResponse({
    status: 200,
    description: 'Registration successful',
    type: AuthTokens,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
    type: Error,
  })
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(authValidator)

    const user = await UserModel.findOne({ email })

    if (user) {
      const passwordVerified = await user.verifyPassword(password)
      if (!passwordVerified) return response.unauthorized({ message: 'Invalid email or password' })
    } else {
      return response.unauthorized({ message: 'User not found' })
    }

    const accessToken = jwt.sign({ userId: user.id }, appKey.release(), { expiresIn: '15m' })

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 60 * 15,
    })

    return {
      accessToken,
    }
  }

  @ApiOperation({ summary: 'Logs out the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    type: Success,
  })
  async logout({ response }: HttpContext) {
    response.clearCookie('accessToken')

    return {
      message: 'Logout successful',
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Sends a list of users',
    type: User,
  })
  async me({ request, response }: HttpContext) {
    console.log(request.auth)
    if (!request.auth.user) return response.unauthorized({ message: 'Invalid auth' })

    const user = UserModel.findById(request.auth.user.userId)

    if (!user) return response.unauthorized({ message: 'User not found' })

    return user
  }
}
