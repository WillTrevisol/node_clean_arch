import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { type Controller } from '../protocols/controller'
import { MissingParameterError } from '../errors/missing-parameter-error'
import { badRequest } from '../helpers/http-helper'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParameterError(field))
      }
    }

    return {
      statusCode: 500,
      body: new Error('internal server error')
    }
  }
}
