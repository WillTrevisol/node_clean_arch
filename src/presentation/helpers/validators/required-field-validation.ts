import { MissingParameterError } from '../../errors'
import { type Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  private readonly fieldName: string
  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (data: any): any {
    if (!data[this.fieldName]) {
      return new MissingParameterError(this.fieldName)
    }
  }
}
