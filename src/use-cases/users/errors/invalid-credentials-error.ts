export class InvalidCredentialsError extends Error {
  constructor() {
    super(`Invalid Credentials.`)
    this.name = 'InvalidCredentialsError'
  }

  statusCode = 400
  serialize() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    }
  }
}
