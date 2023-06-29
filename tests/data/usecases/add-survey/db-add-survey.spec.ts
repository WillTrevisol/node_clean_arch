import { AddSurveyRepository } from '../../../../src/data/usecases/add-survey/db-add-survey-protocols'
import { AddSurveyModel } from '../../../../src/domain/usecases'
import { DbAddSurvey } from '../../../../src/data/usecases/add-survey/db-add-survey'


const fakeSurveyFactory = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

const addSurveyRepositoryStubFactory = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
      return Promise.resolve()
    }
  }

  return new AddSurveyRepositoryStub()
}

interface SutTypes {
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
  test('Should call AddSurveyRepository with correct values', async () => {
    const { systemUnderTest, addSurveyRepositoryStub } = sutFactory()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = fakeSurveyFactory()
    await systemUnderTest.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { systemUnderTest, addSurveyRepositoryStub } = sutFactory()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = systemUnderTest.add(fakeSurveyFactory())
    await expect(promise).rejects.toThrow()
  })
})