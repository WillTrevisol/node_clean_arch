import { type LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result'
import { mockLoadSurveyResultRepository } from '@/tests/data/mocks'

type SutTypes = {
  systemUnderTest: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const sutFactory = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const systemUnderTest = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

  return {
    systemUnderTest,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurvey UseCase', () => {
  test('Should call LoadSurveyResultRepository with correct value', async () => {
    const { systemUnderTest, loadSurveyResultRepositoryStub } = sutFactory()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await systemUnderTest.load('any_survey_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { systemUnderTest, loadSurveyResultRepositoryStub } = sutFactory()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const result = systemUnderTest.load('any_survey_id')
    await expect(result).rejects.toThrow()
  })
})
