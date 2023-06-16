import { InvalidParameterError } from '../../errors'
import { type Validation } from './validation'

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldToCompare: string
  constructor (fieldName: string, fieldToCompare: string) {
    this.fieldName = fieldName
    this.fieldToCompare = fieldToCompare
  }

  validate (data: any): any {
    if (data[this.fieldName] !== data[this.fieldToCompare]) {
      return new InvalidParameterError(this.fieldToCompare)
    }
  }
}
