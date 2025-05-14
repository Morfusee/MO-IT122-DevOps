import UserModel from '#models/user'
import { authValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import jwt from 'jsonwebtoken'
import { Success, Error, AuthTokens } from '../schemas/response.js'
import { appKey } from '#config/app'
import { AuthForm, RegisterForm } from '../schemas/auth.js'
import { User } from '../schemas/user.js'
import Logger from '@adonisjs/core/services/logger'
import Mappers from '../util/mappers.js'

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
   * @param {HttpContext} context - The HTTP context containing request and response
   * @param {Request} context.request - The request object containing user registration data
   * @param {Response} context.response - The response object for sending HTTP responses
   * @returns {Success} A success message if registration is successful
   * @throws {Error} If the user already exists (409 Conflict)
   */
  @ApiOperation({ summary: 'Registers a new user' })
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
   * @param {HttpContext} context - The HTTP context containing request and response
   * @param {Request} context.request - The request object containing login credentials
   * @param {Response} context.response - The response object for sending HTTP responses
   * @returns {AuthTokens} An object containing the access token if login is successful
   * @throws {Error} If the credentials are invalid (401 Unauthorized)
   */
  @ApiOperation({ summary: 'Login an existing user' })
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
      maxAge: 60 * 15,
      encode: false,
      // sameSite: 'none',
      // secure: true,
      // domain: 'mcube.uk'
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
   * @param {HttpContext} context - The HTTP context containing request and response
   * @param {Object} context.response - The response object for sending HTTP responses
   * @returns {Object} A success message confirming logout
   */
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

  /**
   * Retrieves information about the currently authenticated user.
   *
   * This method checks if a user is authenticated and returns their profile information.
   * If no user is authenticated, it returns an unauthorized response.
   *
   * @param {HttpContext} context - The HTTP context containing request and response
   * @param {Object} context.request - The request object containing authentication data
   * @param {Object} context.response - The response object for sending HTTP responses
   * @returns {Object} The user's profile information if authenticated
   * @throws {Error} If the user is not authenticated (401 Unauthorized)
   */
  @ApiOperation({ summary: 'Get current user information' })
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
  async me({ request, response }: HttpContext) {
    Logger.info('[AuthController.me] Checking auth user')

    if (!request.auth.user) {
      console.log('[AuthController.me] Invalid auth - user not found in request')
      return response.unauthorized({ message: 'Invalid auth' })
    }

    Logger.debug('[AuthController.me] Looking up user with ID: ' + request.auth.user.userId)
    const user = await UserModel.findById(request.auth.user.userId)

    if (!user) {
      Logger.info('[AuthController.me] User not found in database')
      return response.unauthorized({ message: 'User not found' })
    }

    Logger.info('[AuthController.me] User found, returning user data')

    return response.ok(Mappers.toUserResponse(user))
  }
}
