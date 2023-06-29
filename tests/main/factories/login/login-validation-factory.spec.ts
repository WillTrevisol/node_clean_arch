import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../src/validation/validators'
import { type Validation } from '../../../../src/presentation/controllers/login/login/login-controller-protocols'
import { type EmailValidator } from '../../../../src/validation/protocols/email-validator'
import { loginValidationFactory } from '../../../../src/main/factories/controllers/login/login/login-validation-factory'

jest.mock('../../../../src/validation/validators/validation-composite')

const emailValidatorFactory = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
describe('Login Validation', () => {
  test('Should call ValidationComposite with all validators', () => {
    loginValidationFactory()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation(emailValidatorFactory(), 'email'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
