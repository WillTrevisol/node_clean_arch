import { type SurveyModel } from '@/domain/models'

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}

export type AddSurveyModel = Omit<SurveyModel, 'id'>
