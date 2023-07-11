import { type Validation } from '@/presentation/controllers/login/signup/signup-controller-protocols'
import { MissingParameterError } from '@/presentation/errors'
import { ValidationComposite } from '@/validation/validators'
import { mockValidation } from '@/tests/validation/mocks'

type SutTypes = {
  systemUnderTest: ValidationComposite
  validationStubs: Validation[]
}

const sutFactory = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()]
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
