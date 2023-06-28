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

describe('DbAddSurvey UseCase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (surveyData: AddSurveyModel): Promise<void> {
        return Promise.resolve()
      }
    }
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const systemUnderTest = new DbAddSurvey(addSurveyRepositoryStub)
    const surveyData = fakeSurveyFactory()
    await systemUnderTest.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
})