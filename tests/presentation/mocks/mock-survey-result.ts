import { type LoadSurveyResult, type SaveSurveyResult, type SaveSurveyResultParams } from '@/domain/usecases'
import { type SurveyResultModel } from '@/domain/models'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new SaveSurveyResultStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string): Promise<SurveyResultModel | null> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultStub()
}
