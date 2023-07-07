import { type EmailValidator } from '@/validation/protocols/email-validator'
import { InvalidParameterError } from '@/presentation/errors'
import { type Validation } from '@/presentation/protocols'

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
