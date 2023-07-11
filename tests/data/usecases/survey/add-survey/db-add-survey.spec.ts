import { type AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { DbAddSurvey } from '@/data/usecases/survey/add-survey/db-add-survey'
import { type AddSurveyParams } from '@/domain/usecases'
import MockDate from 'mockdate'

const fakeSurveyFactory = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const addSurveyRepositoryStubFactory = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {
      return Promise.resolve()
    }
  }

  return new AddSurveyRepositoryStub()
}

type SutTypes = {
  systemUnderTest: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const sutFactory = (): SutTypes => {
  const addSurveyRepositoryStub = addSurveyRepositoryStubFactory()
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
    const surveyData = fakeSurveyFactory()
    await systemUnderTest.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { systemUnderTest, addSurveyRepositoryStub } = sutFactory()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = systemUnderTest.add(fakeSurveyFactory())
    await expect(promise).rejects.toThrow()
  })
})
