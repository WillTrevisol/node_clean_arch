import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result-controller'
import { type LoadSurveyById, type SurveyModel, type HttpRequest } from './save-survey-result-controller-protocols'
import MockDate from 'mockdate'

const fakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

const fakeSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_questoin',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const loadSurveyByIdFactory = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return Promise.resolve(fakeSurveyModel())
    }
  }

  return new LoadSurveyByIdStub()
}

type SutTypes = {
  systemUnderTest: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const sutFactory = (): SutTypes => {
  const loadSurveyByIdStub = loadSurveyByIdFactory()
  const systemUnderTest = new SaveSurveyResultController(loadSurveyByIdStub)

  return {
    systemUnderTest,
    loadSurveyByIdStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = sutFactory()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await systemUnderTest.handle(fakeRequest())
    expect(loadByIdSpy).toBeCalledWith('any_survey_id')
  })
})
