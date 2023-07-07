import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/controllers/login/signup/signup-controller-protocols'
import { type LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

export class LoggerControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
