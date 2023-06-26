import { type Validation } from '../../../src/presentation/controllers/login/signup/signup-controller-protocols'
import { MissingParameterError } from '../../../src/presentation/errors'
import { ValidationComposite } from '../../../src/validation/validators'

interface SutTypes {
  systemUnderTest: ValidationComposite
  validationStubs: Validation[]
}

const validationStubFactory = (): Validation => {
  class ValidationStub implements Validation {
    validate (data: any): any {
      return null
    }
  }
  return new ValidationStub()
}

const sutFactory = (): SutTypes => {
  const validationStubs = [validationStubFactory(), validationStubFactory()]
  const systemUnderTest = new ValidationComposite(validationStubs)
  return {
    systemUnderTest,
    validationStubs
  }
}

describe('ValidationComposite', () => {
  test('Should return an error if validation fails', () => {
    const { systemUnderTest, validationStubs } = sutFactory()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
      new MissingParameterError('field')
    )
    const error = systemUnderTest.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParameterError('field'))
  })

  test('Should return the first error if more than one validation fails', () => {
    const { systemUnderTest, validationStubs } = sutFactory()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
      new Error()
    )
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(
      new MissingParameterError('field')
    )
    const error = systemUnderTest.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { systemUnderTest } = sutFactory()
    const error = systemUnderTest.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
