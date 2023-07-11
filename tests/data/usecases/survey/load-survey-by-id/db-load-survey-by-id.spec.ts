import { type LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { type LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { mockLoadSurveyByIdRepository } from '@/tests/data/mocks/mock-db-survey'
import { mockSurveyModel } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  systemUnderTest: LoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const sutFactory = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const systemUnderTest = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

  return {
    systemUnderTest,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyByIdRepository with correct values', async () => {
    const { systemUnderTest, loadSurveyByIdRepositoryStub } = sutFactory()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await systemUnderTest.loadById('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return a survey on success', async () => {
    const { systemUnderTest } = sutFactory()
    const survey = await systemUnderTest.loadById('any_id')
    expect(survey).toEqual(mockSurveyModel())
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { systemUnderTest, loadSurveyByIdRepositoryStub } = sutFactory()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = systemUnderTest.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
