import {
  accountSchema,
  errorSchema,
  loginParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
  signupParamsSchema,
  addSurveySchema,
  saveSurveyResultSchema,
  surveyResultSchema,
  surveyResultAnswerSchema
} from '@/main/docs/schemas/'

export default {
  account: accountSchema,
  signupParams: signupParamsSchema,
  loginParams: loginParamsSchema,
  error: errorSchema,
  surveys: surveysSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  addSurveyParams: addSurveySchema,
  saveSurveyResultParams: saveSurveyResultSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema
}
