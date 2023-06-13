import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/controllers/signup/signup-protocols'

export class LoggerControllerDecorator implements Controller {
  private readonly controller: Controller
  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.controller.handle(httpRequest)
    return Promise.resolve({ statusCode: 204, body: {} })
  }
}
