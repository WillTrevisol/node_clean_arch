import { MissingParameterError } from '@/presentation/errors'
import { RequiredFieldValidation } from '@/validation/validators'

const systemUnderTestFactory = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredFieldValidation', () => {
  test('Should return a MissisngParamError if validation fails', () => {
    const systemUnderTest = systemUnderTestFactory()
    const error = systemUnderTest.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParameterError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const systemUnderTest = systemUnderTestFactory()
    const error = systemUnderTest.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})
