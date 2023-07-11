import { type Validation } from '@/presentation/protocols'

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (data: any): any {
      return null
    }
  }
  return new ValidationStub()
}
