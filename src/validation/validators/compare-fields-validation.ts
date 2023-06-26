import { InvalidParameterError } from '../../presentation/errors'
import { type Validation } from '../../presentation/protocols'

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
