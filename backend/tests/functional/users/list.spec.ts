import { test } from '@japa/runner'

const userCreds = {
  email: 'test@test.com',
  password: '123456',
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
  // const client = new ApiClient()

  // ApiClient.setup(async (req) => {
  //   if (req.du)

  //   const response = await client.post('/login').json(userCreds)
  //   const cookie = response.header('set-cookie')
  //   if (cookie) req.header('cookie', cookie)
  // })

  test('Get me details', async ({ client }) => {
    const response = await client.get('/me')

    response.assertAgainstApiSpec()
  })
})
