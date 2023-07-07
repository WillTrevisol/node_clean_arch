import { type SurveyAnswerModel } from '@/domain/models'

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}
