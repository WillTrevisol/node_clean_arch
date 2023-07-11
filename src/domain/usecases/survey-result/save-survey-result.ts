import { type SurveyResultModel } from '@/domain/models'

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel>
}

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>
