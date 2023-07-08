import { type SurveyResultModel } from '@/domain/models'

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>
