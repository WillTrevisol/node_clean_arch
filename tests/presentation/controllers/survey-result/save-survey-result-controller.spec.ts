import { type LoadSurveyById, type SurveyModel, type HttpRequest, type SaveSurveyResult, type SurveyResultModel, type SaveSurveyResultModel } from '@/presentation/controllers/survey-result//save-survey-result-controller-protocols'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result-controller'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParameterError } from '@/presentation/errors'
import MockDate from 'mockdate'

const fakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

const fakeSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const fakeSurveyResultModel = (): SurveyResultModel => ({
  id: 'valid_id',
  surveyId: 'valid_survey_id',
  accountId: 'valid_account_id',
  answer: 'valid_answer',
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

const saveSurveyResultFactory = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(fakeSurveyResultModel())
    }
  }

  return new SaveSurveyResultStub()
}
type SutTypes = {
  systemUnderTest: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const sutFactory = (): SutTypes => {
  const saveSurveyResultStub = saveSurveyResultFactory()
  const loadSurveyByIdStub = loadSurveyByIdFactory()
  const systemUnderTest = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

  return {
    systemUnderTest,
    loadSurveyByIdStub,
    saveSurveyResultStub
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

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = sutFactory()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await systemUnderTest.handle(fakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParameterError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = sutFactory()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())
    const httpResponse = await systemUnderTest.handle(fakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'invalid_answer'
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParameterError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { systemUnderTest, saveSurveyResultStub } = sutFactory()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await systemUnderTest.handle(fakeRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      surveyId: 'any_survey_id',
      answer: 'any_answer',
      date: new Date()
    })
  })
})
