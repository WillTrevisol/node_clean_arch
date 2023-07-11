import { type LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys'
import { mockLoadSurveysRepository } from '@/tests/data/mocks/mock-db-survey'
import { mockSurveyModelList } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  systemUnderTest: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const sutFactory = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const systemUnderTest = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    systemUnderTest,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { systemUnderTest, loadSurveysRepositoryStub } = sutFactory()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await systemUnderTest.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return a surveys list on success', async () => {
    const { systemUnderTest } = sutFactory()
    const surveys = await systemUnderTest.load()
    expect(surveys).toEqual(mockSurveyModelList())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { systemUnderTest, loadSurveysRepositoryStub } = sutFactory()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())
    const result = systemUnderTest.load()
    await expect(result).rejects.toThrow()
  })
})
