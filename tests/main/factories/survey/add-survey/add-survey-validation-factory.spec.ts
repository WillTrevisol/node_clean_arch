import { addSurveyValidationFactory } from '@/main/factories/controllers/survey/add-survey/add-survey-validation-factory'
import { type Validation } from '@/presentation/controllers/login/login/login-controller-protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

jest.mock('../../../../../src/validation/validators/validation-composite')

describe('AddSurvey Validation', () => {
  test('Should call ValidationComposite with all validators', () => {
    addSurveyValidationFactory()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
