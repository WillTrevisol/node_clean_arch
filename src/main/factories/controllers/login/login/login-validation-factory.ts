import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { type Validation } from '@/presentation/controllers/login/signup/signup-controller-protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const loginValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))
  return new ValidationComposite(validations)
}
