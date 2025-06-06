// import { ApiClient, ApiRequest } from '@japa/api-client'
// import { test } from '@japa/runner'

// const userCreds = {
//   email: 'test@test.com',
//   password: '123456',
//   firstName: 'Mark',
//   lastName: 'Ngo',
// }

// const dummyChat = {
//   prompt: 'Can you teach me about biology?',
// }

// const dummyChat2 = {
//   prompt: 'How does cells woork?',
// }

// test.group('Authentication', () => {
//   test('Register account', async ({ client }) => {
//     const response = await client.post('/register').json(userCreds)

//     response.assertAgainstApiSpec()
//   })

//   test('Log into an account', async ({ client }) => {
//     const response = await client.post('/login').json(userCreds)

//     response.assertAgainstApiSpec()
//   })
// })

// async function loginAndGetCookie(req: ApiRequest) {
//   if (req.config.endpoint == '/login') return
//   const client = new ApiClient()
//   const res = await client.post('/login').json(userCreds)

//   req.header('cookie', `accessToken=${res.body().accessToken}`)
// }

// test.group('Token Verification', () => {
//   ApiClient.setup(loginAndGetCookie)

//   test('Get me details', async ({ client }) => {
//     // Attach it to the request's header
//     const response = await client.get('/me')

//     response.assertAgainstApiSpec()
//   })
// })

// test.group('Chat Functionality Tests', () => {
//   let chatId: string
//   ApiClient.setup(loginAndGetCookie)

//   test('Create a new chat with prompt and template', async ({ client }) => {
//     // Attach it to the request's header
//     const response = await client.post('/chats').json(dummyChat)

//     // Save the chatId for the test group
//     chatId = response.body().chat.id

//     response.assertAgainstApiSpec()
//   })

//   test('Retrieve all saved chat entries', async ({ client }) => {
//     const response = await client.get('/chats')

//     response.assertAgainstApiSpec()
//   })

//   test('Retrieve chat entry by ID', async ({ client }) => {
//     const response = await client.get(`/chats/${chatId}`)

//     response.assertAgainstApiSpec()
//   })

//   test('Update chat name by ID', async ({ client }) => {
//     const newName = 'Updated Name'
//     const response = await client.patch(`/chats/${chatId}`).json({
//       name: newName,
//     })

//     // Check if the name is truly updated
//     response.assertBodyContains({
//       name: newName,
//     })

//     response.assertAgainstApiSpec()
//   })

//   test('Ask the chat AI again', async ({ client }) => {
//     const response = await client.post(`/chats/${chatId}/messages`).json(dummyChat2)

//     response.assertAgainstApiSpec()
//   })

//   test('Retrieve the chat messages', async ({ client, assert }) => {
//     const response = await client.get(`/chats/${chatId}/messages`)

//     response.assertAgainstApiSpec()
//     assert.lengthOf(response.body(), 2)
//   })

//   test('Delete chat entry by ID', async ({ client }) => {
//     const response = await client.delete(`/chats/${chatId}`)

//     response.assertAgainstApiSpec()
//   })
// })

import { test } from '@japa/runner'

test('2 + 2 should equal 4', ({ assert }) => {
  const result = 2 + 3
  assert.equal(result, 4)
})
