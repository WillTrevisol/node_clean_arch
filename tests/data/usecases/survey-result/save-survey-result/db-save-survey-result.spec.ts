import { type LoadSurveyResultRepository, type SaveSurveyResultRepository } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/tests/domain/mocks'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/tests/data/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  systemUnderTest: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const sutFactory = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const systemUnderTest = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)

  return {
    systemUnderTest,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { systemUnderTest, saveSurveyResultRepositoryStub } = sutFactory()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const saveSurveyResultParams = mockSaveSurveyResultParams()
    await systemUnderTest.save(saveSurveyResultParams)
    expect(saveSpy).toHaveBeenCalledWith(saveSurveyResultParams)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { systemUnderTest, saveSurveyResultRepositoryStub } = sutFactory()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const result = systemUnderTest.save(mockSaveSurveyResultParams())
    await expect(result).rejects.toThrow()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { systemUnderTest, loadSurveyResultRepositoryStub } = sutFactory()
    const saveSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const saveSurveyResultParams = mockSaveSurveyResultParams()
    await systemUnderTest.save(saveSurveyResultParams)
    expect(saveSpy).toHaveBeenCalledWith(saveSurveyResultParams.surveyId)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { systemUnderTest, loadSurveyResultRepositoryStub } = sutFactory()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const result = systemUnderTest.save(mockSaveSurveyResultParams())
    await expect(result).rejects.toThrow()
  })

  test('Should return a survey result on success', async () => {
    const { systemUnderTest } = sutFactory()
    const surveyResult = await systemUnderTest.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
