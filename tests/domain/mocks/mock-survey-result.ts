import { type SurveyResultModel } from '@/domain/models'
import { type SaveSurveyResultParams } from '@/domain/usecases'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_asnwer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_questi on',
  answers: [{
    answer: 'any_answer',
    count: 1,
    percent: 50
  }, {
    answer: 'another_answer',
    image: 'any_image',
    count: 1,
    percent: 50
  }],
  date: new Date()
})
