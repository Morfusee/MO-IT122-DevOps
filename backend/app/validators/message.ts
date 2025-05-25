import { Template } from '#services/template_config'
import vine from '@vinejs/vine'

const params = {
  params: vine.object({
    chat_id: vine.string(),
  }),
}

export const chatIdValidator = vine.compile(vine.object(params))

export const createMessageValidator = vine.compile(
  vine.object({
    ...params,
    prompt: vine.string(),
    attachmentUrls: vine.array(vine.string()).optional(),
    template: vine.enum(Object.values(Template)).optional(),
  })
)
