import { BaseCheck, HealthChecks, Result } from '@adonisjs/core/health'
import { HealthCheckResult } from '@adonisjs/core/types/health'
import mongoose from 'mongoose'

class MongoCheck extends BaseCheck {
  name: string = 'MongoDB Connection Check'
  async run(): Promise<HealthCheckResult> {
    try {
      await mongoose.connection.db?.admin().ping()
      return Result.ok('MongoDB is reachable.')
    } catch (error) {
      return Result.failed('MongoDB is NOT reachable.', error)
    }
  }
}

export const healthChecks = new HealthChecks().register([new MongoCheck()])
