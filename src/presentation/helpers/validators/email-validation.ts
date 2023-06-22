import { InvalidParameterError } from '../../errors'
import { type EmailValidator } from '../../protocols/email-validator'
import { type Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly fieldName: string) {}

  validate (data: any): any {
    const isEmailValid = this.emailValidator.isValid(data[this.fieldName])
    if (!isEmailValid) {
      return new InvalidParameterError(this.fieldName)
    }
  }
}
