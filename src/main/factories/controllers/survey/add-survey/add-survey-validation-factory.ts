import { type Validation } from '@/presentation/controllers/login/signup/signup-controller-protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const addSurveyValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
