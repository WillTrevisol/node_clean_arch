import { type LoadSurveyById, type HttpRequest, type LoadSurveyResult } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller-protocols'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { InvalidParameterError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/tests/presentation/mocks'

type SutTypes = {
  systemUnderTest: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const sutFactory = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const systemUnderTest = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
  return {
    systemUnderTest,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

const mockHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct value', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = sutFactory()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await systemUnderTest.handle(mockHttpRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
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

  test('Should call LoadSurveyResult with correct value', async () => {
    const { systemUnderTest, loadSurveyResultStub } = sutFactory()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await systemUnderTest.handle(mockHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })
})
