import UserModel from '#models/user'
import { ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import type { HttpContext } from '@adonisjs/core/http'
import { User } from '../schemas/user.js'

export default class UsersController {
  @ApiOperation({ summary: 'List all users', description: 'List all users' })
  @ApiResponse({
    status: 200,
    description: 'Sends a list of users',
    type: [User],
  })
  async index() {
    return UserModel.find()
  }

  @ApiOperation({ summary: 'Create a new User' })
  store() {
    new UserModel({
      email: 'test@doggy.com',
    }).save()
  }

  @ApiOperation({ summary: 'Register a new User account' })
  register({ response }: HttpContext) {
    response.ok('Doggy')
  }
}
