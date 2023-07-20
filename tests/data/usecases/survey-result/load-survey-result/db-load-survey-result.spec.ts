import { type LoadSurveyResultRepository, type LoadSurveyByIdRepository } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result-protocols'
import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result'
import { mockLoadSurveyResultRepository } from '@/tests/data/mocks'
import { mockLoadSurveyByIdRepository } from '@/tests/data/mocks/mock-db-survey'
import { mockSurveyModel, mockSurveyResultModel } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  systemUnderTest: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const sutFactory = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const systemUnderTest = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)

  return {
    systemUnderTest,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

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

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { systemUnderTest, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = sutFactory()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await systemUnderTest.load('any_survey_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { systemUnderTest, loadSurveyResultRepositoryStub } = sutFactory()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)
    const surveyResult = await systemUnderTest.load('any_survey_id')
    expect(surveyResult).toEqual({
      surveyId: mockSurveyModel().id,
      question: mockSurveyModel().question,
      date: mockSurveyModel().date,
      answers: mockSurveyModel().answers.map(answer => ({
        ...answer,
        count: 0,
        percent: 0
      }))
    })
  })

  test('Should return SurveyResultModel with all answers with count 0 if if LoadSurveyResultRepository returns null', async () => {
    const { systemUnderTest, loadSurveyResultRepositoryStub } = sutFactory()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)
    const surveyResult = await systemUnderTest.load('any_survey_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('Should return SurveyResultModel on success', async () => {
    const { systemUnderTest } = sutFactory()
    const surveyResult = await systemUnderTest.load('any_survey_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
