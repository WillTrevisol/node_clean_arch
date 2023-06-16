import { InvalidParameterError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const systemUnderTestFactory = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFieldsValidation', () => {
  test('Should return a InvalidParameterError if validation fails', () => {
    const systemUnderTest = systemUnderTestFactory()
    const error = systemUnderTest.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    })
    expect(error).toEqual(new InvalidParameterError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const systemUnderTest = systemUnderTestFactory()
    const error = systemUnderTest.validate({
      field: 'any_name',
      fieldToCompare: 'any_name'
    })
    expect(error).toBeFalsy()
  })
})
