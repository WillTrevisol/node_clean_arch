import { type SaveSurveyResultRepository } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/tests/domain/mocks'
import { mockSaveSurveyResultRepository } from '@/tests/data/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  systemUnderTest: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const sutFactory = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const systemUnderTest = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

  return {
    systemUnderTest,
    saveSurveyResultRepositoryStub
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
    const SaveSurveyResultParams = mockSaveSurveyResultParams()
    await systemUnderTest.save(SaveSurveyResultParams)
    expect(saveSpy).toHaveBeenCalledWith(SaveSurveyResultParams)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { systemUnderTest, saveSurveyResultRepositoryStub } = sutFactory()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const result = systemUnderTest.save(mockSaveSurveyResultParams())
    await expect(result).rejects.toThrow()
  })

  test('Should return a survey result on success', async () => {
    const { systemUnderTest } = sutFactory()
    const surveyResult = await systemUnderTest.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
