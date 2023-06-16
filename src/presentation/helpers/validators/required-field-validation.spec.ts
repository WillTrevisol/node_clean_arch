import { MissingParameterError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredFieldValidation', () => {
  test('Should return a MissisngParamError if validation fails', () => {
    const systemUnderTest = new RequiredFieldValidation('field')
    const error = systemUnderTest.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParameterError('field'))
  })
})
