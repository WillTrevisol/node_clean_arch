import { type LoadSurveyById, type HttpRequest, type SaveSurveyResult } from '@/presentation/controllers/survey-result//save-survey-result-controller-protocols'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result-controller'
import { ok, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParameterError } from '@/presentation/errors'
import { mockLoadSurveyById, mockSaveSurveyResult } from '@/tests/presentation/mocks'
import MockDate from 'mockdate'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

const mockHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

type SutTypes = {
  systemUnderTest: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const sutFactory = (): SutTypes => {
  const saveSurveyResultStub = mockSaveSurveyResult()
  const loadSurveyByIdStub = mockLoadSurveyById()
  const systemUnderTest = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

  return {
    systemUnderTest,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = sutFactory()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await systemUnderTest.handle(mockHttpRequest())
    expect(loadByIdSpy).toBeCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = sutFactory()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await systemUnderTest.handle(mockHttpRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParameterError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = sutFactory()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())
    const httpResponse = await systemUnderTest.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'invalid_answer'
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParameterError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { systemUnderTest, saveSurveyResultStub } = sutFactory()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await systemUnderTest.handle(mockHttpRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      surveyId: 'any_survey_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { systemUnderTest, saveSurveyResultStub } = sutFactory()
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error())
    const httpResponse = await systemUnderTest.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle(mockHttpRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
