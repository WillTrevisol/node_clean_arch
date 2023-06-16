import { type Validation } from '../../presentation/controllers/signup/signup-protocols'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { singupValidationFactory } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('Singup Validation', () => {
  test('Should call ValidationComposite with all validators', () => {
    singupValidationFactory()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
