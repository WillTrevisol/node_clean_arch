import { type Validation, type HttpRequest, type AddSurvey } from '@/presentation/controllers/survey/add-survey/add-survey-protocols'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { badRequest, serverError, noContent } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'
import { mockAddSurvey, mockValidation } from '@/tests/presentation/mocks'

const mockHttpRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
})

type SutTypes = {
  systemUnderTest: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const sutFactory = (): SutTypes => {
  const addSurveyStub = mockAddSurvey()
  const validationStub = mockValidation()
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
    const httpResquest = mockHttpRequest()
    await systemUnderTest.handle(httpResquest)
    expect(validateSpy).toHaveBeenCalledWith(httpResquest.body)
  })

  test('Should return 400 if Validation fails', async () => {
    const { systemUnderTest, validationStub } = sutFactory()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await systemUnderTest.handle(mockHttpRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { systemUnderTest, addSurveyStub } = sutFactory()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpResquest = mockHttpRequest()
    await systemUnderTest.handle(httpResquest)
    expect(addSpy).toHaveBeenCalledWith(httpResquest.body)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { systemUnderTest, addSurveyStub } = sutFactory()
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())
    const httpResponse = await systemUnderTest.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle(mockHttpRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
