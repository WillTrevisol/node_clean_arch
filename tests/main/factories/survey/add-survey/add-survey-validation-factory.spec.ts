import { RequiredFieldValidation, ValidationComposite } from '../../../../../src/validation/validators'
import { type Validation } from '../../../../../src/presentation/controllers/login/login/login-controller-protocols'
import { addSurveyValidationFactory } from '../../../../../src/main/factories/controllers/survey/add-survey/add-survey-validation-factory'

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
