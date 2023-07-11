import { type AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { DbAddSurvey } from '@/data/usecases/survey/add-survey/db-add-survey'
import { mockAddSurveyRepository } from '@/tests/data/mocks/mock-db-survey'
import { mockAddSurveyParams } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  systemUnderTest: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const sutFactory = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const systemUnderTest = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    systemUnderTest,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { systemUnderTest, addSurveyRepositoryStub } = sutFactory()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = mockAddSurveyParams()
    await systemUnderTest.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { systemUnderTest, addSurveyRepositoryStub } = sutFactory()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = systemUnderTest.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
