import vine from '@vinejs/vine'

export const promptValidator = vine.compile(
  vine.object({
    prompt: vine.string(),

    params: vine.object({
      chat_id: vine.string(),
    }),
  })
)

export const idValidator = vine.compile(
  vine.object({
    params: vine.object({
      chat_id: vine.string(),
    }),
  })
)
