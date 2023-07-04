import { type HttpRequest, type HttpResponse, type Controller, type LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load()
    return Promise.resolve({
      statusCode: 200,
      body: {}
    })
  }
}
