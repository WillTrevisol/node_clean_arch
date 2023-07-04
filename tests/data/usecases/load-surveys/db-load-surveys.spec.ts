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

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository', async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async loadAll (): Promise<SurveyModel[]> {
        return Promise.resolve(fakeSurveysFactory())
      }
    }
    const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    const systemUnderTest = new DbLoadSurveys(loadSurveysRepositoryStub)
    await systemUnderTest.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
})
