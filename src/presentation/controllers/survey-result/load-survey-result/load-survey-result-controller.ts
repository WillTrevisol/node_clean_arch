import { ok, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { type HttpResponse, type HttpRequest, type Controller, type LoadSurveyById, type LoadSurveyResult } from './load-survey-result-controller-protocols'
import { InvalidParameterError } from '@/presentation/errors'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParameterError('surveyId'))
      }
      await this.loadSurveyResult.load(surveyId)
      return Promise.resolve(ok({}))
    } catch (error) {
      return serverError(error)
    }
  }
}
