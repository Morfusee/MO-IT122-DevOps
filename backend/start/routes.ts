/* eslint-disable @adonisjs/prefer-lazy-controller-import */
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UsersController = () => import('#controllers/users_controller')
import router from '@adonisjs/core/services/router'
import openapi from '@foadonis/openapi/services/main'
import { middleware } from './kernel.js'
const MessagePairController = () => import('#controllers/message_pair_controller')
const AuthController = () => import('#controllers/auth_controller')
const GeminiSamplesController = () => import('#controllers/gemini_samples_controller')
const ChatController = () => import('#controllers/chat_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.resource('users', UsersController)

router.post('/prompt', [GeminiSamplesController, 'index'])

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

router
  .group(() => {
    router.resource('chats', ChatController).apiOnly()
    router.resource('chats.messages', MessagePairController).apiOnly()
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
