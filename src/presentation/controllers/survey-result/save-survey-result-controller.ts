import { forbidden } from '@/presentation/helpers/http/http-helper'
import { type LoadSurveyById, type Controller, type HttpRequest, type HttpResponse } from './save-survey-result-controller-protocols'
import { InvalidParameterError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    if (!survey) {
      return forbidden(new InvalidParameterError('surveyId'))
    }
    return Promise.resolve({
      statusCode: 200,
      body: {}
    })
  }
}
