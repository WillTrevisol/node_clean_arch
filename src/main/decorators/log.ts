import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/controllers/signup/signup-protocols'
import { type LogErrorRepository } from '../../data/protocols/log-error-repository'

export class LoggerControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRespository: LogErrorRepository
  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRespository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRespository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
