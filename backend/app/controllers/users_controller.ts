import UserModel, { User } from '#models/user';
import { ApiOperation, ApiResponse } from '@foadonis/openapi/decorators';
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  
  @ApiOperation({ summary: 'List all users', description: "List all users" })
  @ApiResponse({ 
    status: 200,
    description: 'Sends a list of users',
    type: [User] 
  })
  async index(context: HttpContext) {

    const users = await UserModel.find()
    context.response.ok(users)
  }

  @ApiOperation({ summary: 'Create a new User'})
  store() {
    new UserModel({
      email: "test@doggy.com"
    }).save()

  }
  
  @ApiOperation({ summary: 'Register a new User account' })
  register(context: HttpContext) {

    context.response.ok("Doggy")
  }
}