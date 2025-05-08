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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.resource('users', UsersController)


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
