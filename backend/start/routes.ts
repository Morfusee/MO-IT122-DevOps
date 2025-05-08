/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import openapi from '@foadonis/openapi/services/main'
import { middleware } from './kernel.js'
import AuthController from '#controllers/auth_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.resource('users', UsersController)

router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
  router.post('/logout', [AuthController, 'logout'])
})

router
  .group(() => {
    router.get('/me', [AuthController, 'me'])
  })
  .use(middleware.auth())

/**
 * FIX: No UI for /api route
 *
 * Source: https://github.com/FriendsOfAdonis/FriendsOfAdonis/issues/48
 */
router.get('/docs', () => openapi.generateUi('/api'))

/**
 * Example for creating a route that registers for OpenAPI
 */
// const PostsController = () => import('#controllers/posts_controller')
// router.resource('posts', PostsController)

openapi.registerRoutes()
