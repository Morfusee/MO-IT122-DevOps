import vine from '@vinejs/vine'

const email = vine.string().email().normalizeEmail()
const password = vine.string().minLength(6)

export const authValidator = vine.compile(
  vine.object({
    email,
    password,
  })
)
