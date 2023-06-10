export class InvalidParameterError extends Error {
  constructor (parameter: string) {
    super(`Invalid parameter: ${parameter}`)
    this.name = 'InvalidParameterError'
  }
}
