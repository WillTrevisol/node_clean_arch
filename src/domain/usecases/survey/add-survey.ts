import { type SurveyModel } from '@/domain/models'

export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}

export type AddSurveyParams = Omit<SurveyModel, 'id'>
