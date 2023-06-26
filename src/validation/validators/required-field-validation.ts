import { MissingParameterError } from '../../presentation/errors/'
import { type Validation } from '../../presentation/protocols'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (data: any): any {
    if (!data[this.fieldName]) {
      return new MissingParameterError(this.fieldName)
    }
  }
}
