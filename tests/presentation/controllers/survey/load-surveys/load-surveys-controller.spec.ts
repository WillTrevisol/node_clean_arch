import { type LoadSurveys } from '@/domain/usecases'
import { type SurveyModel } from '@/domain/models'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { ok, noContent, serverError } from '@/presentation/helpers/http/http-helper'
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

const loadSurveysStubFactory = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return Promise.resolve(fakeSurveysFactory())
    }
  }
  return new LoadSurveysStub()
}

type SutTypes = {
  systemUnderTest: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const sutFactory = (): SutTypes => {
  const loadSurveysStub = loadSurveysStubFactory()
  const systemUnderTest = new LoadSurveysController(loadSurveysStub)

  return {
    systemUnderTest,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    const { systemUnderTest, loadSurveysStub } = sutFactory()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await systemUnderTest.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle({})
    expect(httpResponse).toEqual(ok(fakeSurveysFactory()))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { systemUnderTest, loadSurveysStub } = sutFactory()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(
      Promise.resolve([])
    )
    const httpResponse = await systemUnderTest.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { systemUnderTest, loadSurveysStub } = sutFactory()
    jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await systemUnderTest.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
