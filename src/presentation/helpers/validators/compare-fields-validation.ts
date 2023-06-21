import { InvalidParameterError } from '../../errors'
import { type Validation } from '../../protocols/validation'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompare: string) {}

  validate (data: any): any {
    if (data[this.fieldName] !== data[this.fieldToCompare]) {
      return new InvalidParameterError(this.fieldToCompare)
    }
  }
}
