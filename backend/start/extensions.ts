interface Auth {
  userId: string
}

declare module '@adonisjs/core/http' {
  interface Request {
    auth: {
      user?: Auth
    }
  }
}
