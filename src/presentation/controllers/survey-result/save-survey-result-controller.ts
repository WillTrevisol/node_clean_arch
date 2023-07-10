import { noContent, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { type LoadSurveyById, type Controller, type HttpRequest, type HttpResponse } from './save-survey-result-controller-protocols'
import { InvalidParameterError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body.answer
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const asnwers = survey.answers.map(survey => survey.answer)
        if (!asnwers.includes(answer)) {
          return forbidden(new InvalidParameterError('answer'))
        }
      } else {
        return forbidden(new InvalidParameterError('surveyId'))
      }
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
