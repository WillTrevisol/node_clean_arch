import { LoadSurveysController } from '../../../../../src/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { SurveyModel } from '../../../../../src/domain/models'
import { LoadSurveys } from '../../../../../src/domain/usecases'
import MockDate from 'mockdate'

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

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    class LoadSurveysStub implements LoadSurveys {
      async load (): Promise<SurveyModel[]> {
        return Promise.resolve(fakeSurveysFactory())
      }
    }
    const loadSurveysStub = new LoadSurveysStub()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    const systemUnderTest = new LoadSurveysController(loadSurveysStub)
    systemUnderTest.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
