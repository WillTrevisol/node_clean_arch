import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { type Validation } from '@/presentation/controllers/login/signup/signup-controller-protocols'
import { CompareFieldsValidation, RequiredFieldValidation, EmailValidation, ValidationComposite } from '@/validation/validators'

export const singupValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))
  return new ValidationComposite(validations)
}
