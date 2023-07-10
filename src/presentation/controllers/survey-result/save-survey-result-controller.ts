import { noContent, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { type LoadSurveyById, type Controller, type HttpRequest, type HttpResponse } from './save-survey-result-controller-protocols'
import { InvalidParameterError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
      if (!survey) {
        return forbidden(new InvalidParameterError('surveyId'))
      }
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
