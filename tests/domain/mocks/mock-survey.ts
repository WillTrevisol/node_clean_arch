import { type SurveyModel } from '@/domain/models'
import { type AddSurveyParams } from '@/domain/usecases'

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

export const mockSurveyModel = (): SurveyModel => Object.assign({}, mockAddSurveyParams(), ({ id: 'any_id' }))

export const mockSurveyModelList = (): SurveyModel[] => {
  return [
    mockSurveyModel(),
    mockSurveyModel()
  ]
}
