import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as fs from 'node:fs'
import Logger from '@adonisjs/core/services/logger'

export default class FileUploads {
  static async uploadImage(image: string, type: string) {
    let imagePath: string | null = null
    Logger.info('Starting uploadImage method', { type })

    if (image && type === 'base64') {
      try {
        // Remove data URL prefix if present
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '')

        const fileName = `${Date.now()}-ai-image.png`
        const dirPath = path.join(
          dirname(fileURLToPath(import.meta.url)),
          '..',
          '..',
          'public',
          'images'
        )
        const filePath = path.join(dirPath, fileName)

        Logger.debug('Preparing to write file', { fileName, filePath })

        // Ensure directory exists
        fs.mkdirSync(dirPath, { recursive: true })

        // Write file
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'))

        imagePath = `/public/images/${fileName}` // Better placeholder
        Logger.info('Image successfully written', { imagePath })
      } catch (error) {
        Logger.error('Failed to write image to file', {
          message: error.message,
          stack: error.stack,
        })
      }
    } else {
      Logger.warn('Invalid image or type', { imagePresent: !!image, type })
    }

    return imagePath
  }
}
