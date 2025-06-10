import UserModel from '#models/user'
import { authValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import jwt from 'jsonwebtoken'
import { Success, Error, AuthTokens } from '../schemas/response.js'
import { appKey } from '#config/app'
import { AuthForm, RegisterForm } from '../schemas/auth.js'
import { User } from '../schemas/user.js'

/**
 * AuthController handles user authentication operations including registration,
 * login, logout, and retrieving the current user's information.
 *
 * This controller provides endpoints for user management and authentication
 * using JWT tokens for secure access.
 */
export default class AuthController {
  /**
   * Registers a new user in the system.
   *
   * This method validates the incoming registration data, checks if the user
   * already exists, and creates a new user record if the email is not already taken.
   *
   */
  @ApiOperation({ description: 'Registers a new user' })
  @ApiBody({ type: RegisterForm })
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
    const { firstName, lastName } = request.only(['firstName', 'lastName'])

    const existing = await UserModel.findOne({ email })
    if (existing) {
      return response.conflict({ message: 'User already exists' })
    }

    await UserModel.create({ email, passwordHash: password, firstName, lastName })

    return response.ok({ message: 'Successfully registered the user' })
  }

  /**
   * Authenticates a user and creates a JWT token for authorized access.
   *
   * This method validates the login credentials, verifies the user exists,
   * checks the password, and if valid, generates a JWT token and sets it
   * as an HTTP-only cookie.
   *
   */
  @ApiOperation({ description: 'Login an existing user' })
  @ApiBody({ type: AuthForm })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
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

    response.plainCookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 86400,
      encode: false,
      domain: 'mcube.uk',
    })

    return {
      accessToken,
    }
  }

  /**
   * Logs out the currently authenticated user.
   *
   * This method clears the authentication cookie, effectively ending the user's session.
   *
   */
  @ApiOperation({ description: 'Logs out the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    type: Success,
  })
  async logout({ response }: HttpContext) {
    response.clearCookie('accessToken', {
      secure: true,
      sameSite: 'none',
      domain: 'mcube.uk',
    })

    return {
      message: 'Logout successful',
    }
  }

  /**
   * Retrieves information about the currently authenticated user.
   *
   * This method checks if a user is authenticated and returns their profile information.
   * If no user is authenticated, it returns an unauthorized response.
   *
   */
  @ApiOperation({ description: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user information',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: Error,
  })
  async me({ request, response, logger }: HttpContext) {
    logger.info('Checking auth user')

    if (!request.auth.user) {
      logger.error('Invalid auth - user not found in request')
      return response.unauthorized({ message: 'Invalid auth' })
    }

    logger.debug('Looking up user with ID: ' + request.auth.user.userId)
    const user = await UserModel.findById(request.auth.user.userId)

    if (!user) {
      logger.error('User not found in database')
      return response.unauthorized({ message: 'User not found' })
    }

    logger.info('User found, returning user data')

    return response.ok({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    })
  }
}
