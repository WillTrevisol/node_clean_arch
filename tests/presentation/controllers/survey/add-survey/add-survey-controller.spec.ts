import { Validation, type HttpRequest } from '../../../../../src/presentation/controllers/survey/add-survey/add-survey-protocols'
import { AddSurveyController } from '../../../../../src/presentation/controllers/survey/add-survey/add-survey-controller'

const httpRequestFactory = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate (data: any): any {
        return null
      }
    }
    const validationStub = new ValidationStub()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const systemUnderTest = new AddSurveyController(validationStub)
    const httpResquest = httpRequestFactory()
    await systemUnderTest.handle(httpResquest)
    expect(validateSpy).toHaveBeenCalledWith(httpResquest.body)
  })
})
