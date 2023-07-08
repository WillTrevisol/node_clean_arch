import { type LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { type SurveyModel, type LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols'
import { DbLoadSurveyById } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id'
import MockDate from 'mockdate'

const fakeSurveyFactory = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

type SutTypes = {
  systemUnderTest: LoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const loadSurveyByIdRepositoryStubFactory = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel | null> {
      return Promise.resolve(fakeSurveyFactory())
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

const sutFactory = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = loadSurveyByIdRepositoryStubFactory()
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
    expect(survey).toEqual(fakeSurveyFactory())
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { systemUnderTest, loadSurveyByIdRepositoryStub } = sutFactory()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = systemUnderTest.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
