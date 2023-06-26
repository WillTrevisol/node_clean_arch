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

const validationStubFactory = (): Validation => {
  class ValidationStub implements Validation {
    validate (data: any): any {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  systemUnderTest: AddSurveyController
  validationStub: Validation
}

const sutFactory = (): SutTypes => {
  const validationStub = validationStubFactory()
  const systemUnderTest = new AddSurveyController(validationStub)

  return {
    systemUnderTest,
    validationStub
  }
}

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { systemUnderTest, validationStub } = sutFactory()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpResquest = httpRequestFactory()
    await systemUnderTest.handle(httpResquest)
    expect(validateSpy).toHaveBeenCalledWith(httpResquest.body)
  })
})
