import { type HttpRequest, type HttpResponse, type Middleware } from '../protocols'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError())
  }
}
