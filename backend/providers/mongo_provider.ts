import env from '#start/env'
import type { ApplicationService } from '@adonisjs/core/types'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

export default class MongoProvider {
  constructor(protected app: ApplicationService) {}
  private memoryDB: MongoMemoryServer | null = null

  /**
   * The container bindings have booted
   */
  async boot() {
    if (this.app.getEnvironment() === 'web') {
      const isDockerRunning = env.get('IS_DOCKERIZED')
      const DB_URI = isDockerRunning ? env.get('MONGO_DOCKER_URI') : env.get('MONGO_ATLAS_URI')

      await mongoose.connect(DB_URI)

      console.log('Using atlas as the database')
    }

    if (this.app.getEnvironment() === 'test') {
      this.memoryDB = await MongoMemoryServer.create()

      await mongoose.connect(this.memoryDB.getUri())

      console.log('Using mongo-memory as the database')
    }
  }

  async shutdown() {
    if (this.app.getEnvironment() === 'test') {
      if (this.memoryDB) {
        await this.memoryDB.stop()

        console.log('Stopping mongo-memory instance')
      }
    }

    // * Clear mongoose models before each test run to avoid conflicts
    if (env.get('NODE_ENV') === 'test' || env.get('NODE_ENV') === 'development') {
      clearMongooseModels()
    }
  }
}

function clearMongooseModels() {
  Object.keys(mongoose.models).forEach((model) => {
    delete mongoose.models[model]
  })
}
