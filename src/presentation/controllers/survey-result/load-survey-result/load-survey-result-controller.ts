import { ok } from '@/presentation/helpers/http/http-helper'
import { type HttpResponse, type HttpRequest, type Controller, type LoadSurveyById } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    return Promise.resolve(ok({}))
  }
}
