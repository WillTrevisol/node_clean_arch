import { type HttpRequest, type HttpResponse, type Controller, type Validation } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return Promise.resolve({
      body: '',
      statusCode: 200
    })
  }
}
