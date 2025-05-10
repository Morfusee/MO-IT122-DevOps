import env from '#start/env'
import type { ApplicationService } from '@adonisjs/core/types'
import mongoose from 'mongoose'

export default class MongoProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The container bindings have booted
   */
  async boot() {
    const isDockerRunning = env.get('IS_DOCKERIZED')
    const DB_URI = isDockerRunning ? env.get('MONGO_DOCKER_URI') : env.get('MONGO_ATLAS_URI')

    await mongoose.connect(DB_URI)
  }
}
