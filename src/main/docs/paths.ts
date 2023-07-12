import { signupPath, loginPath, surveyResultPath, surveyPath } from '@/main/docs/paths/'

export default {
  '/signup': signupPath,
  '/login': loginPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
