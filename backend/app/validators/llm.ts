import vine from '@vinejs/vine'

export const promptValidator = vine.compile(
  vine.object({
    prompt: vine.string(),
  })
)
