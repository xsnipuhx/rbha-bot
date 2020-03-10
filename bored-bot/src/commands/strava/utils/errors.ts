export class MissingResourceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "MissingResourceError"
  }
}