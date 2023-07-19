import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { type LoadSurveyById, type HttpRequest } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import { mockLoadSurveyById } from '@/tests/presentation/mocks'

type SutTypes = {
  systemUnderTest: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const sutFactory = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const systemUnderTest = new LoadSurveyResultController(loadSurveyByIdStub)
  return {
    systemUnderTest,
    loadSurveyByIdStub
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
})
