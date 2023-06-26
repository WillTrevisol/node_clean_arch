import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../src/validation/validators'
import { type Validation } from '../../../src/presentation/controllers/signup/signup-controller-protocols'
import { type EmailValidator } from '../../../src/validation/protocols/email-validator'
import { singupValidationFactory } from '../../../src/main/factories/controllers/singup/signup-validation-factory'

jest.mock('../../../src/validation/validators/validation-composite')

const emailValidatorFactory = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
describe('Singup Validation', () => {
  test('Should call ValidationComposite with all validators', () => {
    singupValidationFactory()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation(emailValidatorFactory(), 'email'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
