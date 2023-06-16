import { InvalidParameterError } from '../../errors'
import { type EmailValidator } from '../../protocols/email-validator'
import { type Validation } from './validation'

export class EmailValidation implements Validation {
  private readonly emailValidator: EmailValidator
  private readonly fieldName: string
  constructor (emailValidator: EmailValidator, fieldName: string) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (data: any): any {
    const isEmailValid = this.emailValidator.isValid(data[this.fieldName])
    if (!isEmailValid) {
      return new InvalidParameterError(this.fieldName)
    }
  }
}
