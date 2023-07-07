import { type Validation, type HttpRequest, type AddSurvey, type AddSurveyModel } from '@/presentation/controllers/survey/add-survey/add-survey-protocols'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { badRequest, serverError, noContent } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'

const httpRequestFactory = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
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

const addSurveyStubFactory = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

interface SutTypes {
  systemUnderTest: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const sutFactory = (): SutTypes => {
  const addSurveyStub = addSurveyStubFactory()
  const validationStub = validationStubFactory()
  const systemUnderTest = new AddSurveyController(validationStub, addSurveyStub)

  return {
    systemUnderTest,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct values', async () => {
    const { systemUnderTest, validationStub } = sutFactory()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpResquest = httpRequestFactory()
    await systemUnderTest.handle(httpResquest)
    expect(validateSpy).toHaveBeenCalledWith(httpResquest.body)
  })

  test('Should return 400 if Validation fails', async () => {
    const { systemUnderTest, validationStub } = sutFactory()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await systemUnderTest.handle(httpRequestFactory())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { systemUnderTest, addSurveyStub } = sutFactory()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpResquest = httpRequestFactory()
    await systemUnderTest.handle(httpResquest)
    expect(addSpy).toHaveBeenCalledWith(httpResquest.body)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { systemUnderTest, addSurveyStub } = sutFactory()
    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await systemUnderTest.handle(httpRequestFactory())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle(httpRequestFactory())
    expect(httpResponse).toEqual(noContent())
  })
})
