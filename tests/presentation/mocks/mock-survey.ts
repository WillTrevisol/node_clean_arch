import { type SurveyModel } from '@/domain/models'
import { type AddSurvey, type AddSurveyParams } from '@/domain/usecases'
import { type LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { mockSurveyModel } from '@/tests/domain/mocks'

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdStub()
}

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}
