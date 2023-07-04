import { type SurveyAnswerModel } from '../models'

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}

export interface AddSurveyModel {
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}
