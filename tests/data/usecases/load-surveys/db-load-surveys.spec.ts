import { LoadSurveysRepository } from '../../../../src/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../../src/domain/models'
import { DbLoadSurveys } from '../../../../src/data/usecases/load-surveys/db-load-surveys'

const fakeSurveysFactory = (): SurveyModel[] => {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }, {
    id: 'another_id',
    question: 'another_question',
    answers: [{
      image: 'another_image',
      answer: 'another_answer'
    }],
    date: new Date()
  }]
}

const loadSurveysRepositoryStubFactory = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return Promise.resolve(fakeSurveysFactory())
    }
  }
  return new LoadSurveysRepositoryStub()
}

interface SutTypes {
  systemUnderTest: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const sutFactory = (): SutTypes => {
  const loadSurveysRepositoryStub = loadSurveysRepositoryStubFactory()
  const systemUnderTest = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    systemUnderTest,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository', async () => {
    const { systemUnderTest, loadSurveysRepositoryStub } = sutFactory()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await systemUnderTest.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return a surveys list on success', async () => {
    const { systemUnderTest } = sutFactory()
    const surveys = await systemUnderTest.load()
    expect(surveys).toEqual(fakeSurveysFactory())
  })
})
