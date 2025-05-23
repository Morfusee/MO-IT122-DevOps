import { ApiClient } from '@japa/api-client'
import { test } from '@japa/runner'

const userCreds = {
  email: 'test@test.com',
  password: '123456',
  firstName: 'Mark',
  lastName: 'Ngo',
}

const dummyChat = {
  prompt: 'What is the best place to travel to?',
  attachmentUrls: [''],
  template: 'summarize',
}

async function loginAndGetCookie(client: ApiClient) {
  const response = await client.post('/login').json(userCreds)
  return response.header('set-cookie')?.[0] ?? ''
}

test.group('Authentication', () => {
  test('Register account', async ({ client }) => {
    const response = await client.post('/register').json(userCreds)

    response.assertAgainstApiSpec()
  })

  test('Log into an account', async ({ client }) => {
    const response = await client.post('/login').json(userCreds)

    response.assertAgainstApiSpec()
  })
})

test.group('Token Verification', () => {
  test('Get me details', async ({ client }) => {
    // Get the cookie from the response
    const cookie = await loginAndGetCookie(client)

    // Attach it to the request's header
    const response = await client.get('/me').header('cookie', cookie)

    response.assertAgainstApiSpec()
  })
})

test.group('Chat Functionality Tests', (group) => {
  let cookie: string
  let chatId: string

  group.each.setup(async ({ context }) => {
    const { client } = context
    cookie = await loginAndGetCookie(client)
  })

  test('Create a new chat with prompt and template', async ({ client }) => {
    // Attach it to the request's header
    const response = await client.post('/chats').header('cookie', cookie).json(dummyChat)

    // Save the chatId for the test group
    chatId = response.body().chat.id

    response.assertAgainstApiSpec()
  })

  test('Retrieve all saved chat entries', async ({ client }) => {
    const response = await client.get('/chats').header('cookie', cookie)

    response.assertAgainstApiSpec()
  })

  test('Retrieve chat entry by ID', async ({ client }) => {
    const response = await client.get('/chats/' + chatId).header('cookie', cookie)

    response.assertAgainstApiSpec()
  })

  test('Update chat name by ID', async ({ client }) => {
    const newName = 'Updated Name'
    const response = await client
      .patch('/chats/' + chatId)
      .header('cookie', cookie)
      .json({
        name: newName,
      })

    // Check if the name is truly updated
    response.assertBodyContains({
      name: newName,
    })

    response.assertAgainstApiSpec()
  })

  test('Delete chat entry by ID', async ({ client }) => {
    const response = await client.delete('/chats/' + chatId).header('cookie', cookie)

    response.assertAgainstApiSpec()
  })
})
