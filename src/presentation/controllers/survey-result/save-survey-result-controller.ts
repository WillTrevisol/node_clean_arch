import { noContent, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { type LoadSurveyById, type Controller, type HttpRequest, type HttpResponse, type SaveSurveyResult } from './save-survey-result-controller-protocols'
import { InvalidParameterError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const asnwers = survey.answers.map(survey => survey.answer)
        if (!asnwers.includes(answer)) {
          return forbidden(new InvalidParameterError('answer'))
        }
      } else {
        return forbidden(new InvalidParameterError('surveyId'))
      }
      await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date()
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
