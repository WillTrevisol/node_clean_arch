import { type Validation } from '@/presentation/protocols'

export const mockValidation = (): Validation => {
  class ValidationSub implements Validation {
    validate (data: any): any {
      return null
    }
  }
  return new ValidationSub()
}
