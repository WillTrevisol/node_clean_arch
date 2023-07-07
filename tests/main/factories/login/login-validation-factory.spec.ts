import { loginValidationFactory } from '@/main/factories/controllers/login/login/login-validation-factory'
import { type Validation } from '@/presentation/controllers/login/login/login-controller-protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { type EmailValidator } from '@/validation/protocols/email-validator'

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
