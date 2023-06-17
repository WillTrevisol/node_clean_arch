import { CompareFieldsValidation, RequiredFieldValidation, EmailValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { type Validation } from '../../../presentation/controllers/signup/signup-protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const singupValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))
  return new ValidationComposite(validations)
}
