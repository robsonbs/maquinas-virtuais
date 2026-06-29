export class ResourceNotFoundError extends Error {
  constructor() {
    super(`Resource Not Found.`)
    this.name = 'ResourceNotFoundError'
  }

  statusCode = 404
  serialize() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    }
  }
}
