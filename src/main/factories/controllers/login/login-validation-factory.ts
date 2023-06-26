import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { type Validation } from '../../../../presentation/controllers/signup/signup-controller-protocols'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

export const loginValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))
  return new ValidationComposite(validations)
}
