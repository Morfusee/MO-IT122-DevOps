import { Template } from '#services/template_config'
import vine from '@vinejs/vine'

const params = {
  params: vine.object({
    id: vine.string(),
  }),
}

export const chatIdValidator = vine.compile(vine.object(params))

export const editNameValidator = vine.compile(
  vine.object({
    ...params,
    name: vine.string(),
  })
)

export const createChatValidator = vine.compile(
  vine.object({
    prompt: vine.string(),
    attachmentUrls: vine.array(vine.string()).optional(),
    template: vine.enum(Object.values(Template)).optional(),
  })
)
