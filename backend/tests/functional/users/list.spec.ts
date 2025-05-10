import { test } from '@japa/runner'

test.group('Users list', () => {
  test('Get users', async ({ client }) => {
    const response = await client.get('/users')
    response.assertAgainstApiSpec()
  })
})
