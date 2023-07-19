import { ok, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { type HttpResponse, type HttpRequest, type Controller, type LoadSurveyById } from './load-survey-result-controller-protocols'
import { InvalidParameterError } from '@/presentation/errors'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
      if (!survey) {
        return forbidden(new InvalidParameterError('surveyId'))
      }
      return Promise.resolve(ok({}))
    } catch (error) {
      return serverError(error)
    }
  }
}
