import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import testUtils from '@adonisjs/core/services/test_utils'
import { openapi as openapiAssert } from '@japa/openapi-assertions'
import { writeFile } from 'fs/promises'
import { existsSync } from 'fs'

/**
 * This file is imported by the "bin/test.ts" entrypoint file
 */

/**
 * Configure Japa plugins in the plugins array.
 * Learn more - https://japa.dev/docs/runner-config#plugins-optional
 */
export const plugins: Config['plugins'] = await (async () => {
  const filePath = 'resources/api-schema.json'
  const apiUrl = 'http://localhost:3333/api'

  if (!existsSync(filePath)) {
    const res = await fetch(apiUrl)
    const schema = await res.text()
    await writeFile(app.makePath(filePath), schema)
  }

  return [
    assert(),
    openapiAssert({
      schemas: [app.makePath(filePath)],
    }),
    apiClient(),
    pluginAdonisJS(app),
  ]
})()

/**
 * Configure lifecycle function to run before and after all the
 * tests.
 *
 * The setup functions are executed before all the tests
 * The teardown functions are executed after all the tests
 */
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [],
  teardown: [],
}

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}
