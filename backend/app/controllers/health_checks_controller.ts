import { healthChecks } from '#start/health'
import type { HttpContext } from '@adonisjs/core/http'

export default class HealthChecksController {
  async handle({ response }: HttpContext) {
    const report = await healthChecks.run()

    const { debugInfo, ...safeReport } = report

    if (report.isHealthy) {
      return response.ok(safeReport)
    }

    return response.serviceUnavailable(safeReport)
  }
}
