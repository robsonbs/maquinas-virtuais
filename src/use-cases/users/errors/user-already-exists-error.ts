export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists.`)
    this.name = 'UserAlreadyExistsError'
  }

  statusCode = 409
  serialize() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    }
  }
}
