import { type SurveyResultModel } from '@/domain/models'
import { type SaveSurveyResultParams } from '@/domain/usecases'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_asnwer',
  date: new Date()
})

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_asnwer',
  date: new Date()
})
