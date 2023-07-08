import { type SurveyResultModel, type SaveSurveyResultRepository, type SaveSurveyResultModel } from '@/data/usecases/save-survey-result/db-save-survey-result-protocols'
import { DbSaveSurveyResult } from '@/data/usecases/save-survey-result/db-save-survey-result'
import MockDate from 'mockdate'

const fakeSurveyResultFactory = (): SurveyResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_asnwer',
  date: new Date()
})

const fakeSaveSurveyResultModelFactory = (): SaveSurveyResultModel => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_asnwer',
  date: new Date()
})

const saveSurveyResultRepositoryStubFactory = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(fakeSurveyResultFactory())
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  systemUnderTest: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const sutFactory = (): SutTypes => {
  const saveSurveyResultRepositoryStub = saveSurveyResultRepositoryStubFactory()
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
    const saveSurveyResultModel = fakeSaveSurveyResultModelFactory()
    await systemUnderTest.save(saveSurveyResultModel)
    expect(saveSpy).toHaveBeenCalledWith(saveSurveyResultModel)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { systemUnderTest, saveSurveyResultRepositoryStub } = sutFactory()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const result = systemUnderTest.save(fakeSaveSurveyResultModelFactory())
    await expect(result).rejects.toThrow()
  })

  test('Should return a survey result on success', async () => {
    const { systemUnderTest } = sutFactory()
    const surveyResult = await systemUnderTest.save(fakeSaveSurveyResultModelFactory())
    expect(surveyResult).toEqual(fakeSurveyResultFactory())
  })
})
