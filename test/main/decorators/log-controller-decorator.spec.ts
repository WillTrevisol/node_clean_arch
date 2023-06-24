import { type Controller, type HttpRequest, type HttpResponse } from '../../../src/presentation/protocols'
import { LoggerControllerDecorator } from '../../../src/main/decorators/log-controller-decorator'
import { ok, serverError } from '../../../src/presentation/helpers/http/http-helper'
import { type LogErrorRepository } from '../../../src/data/protocols/db/log/log-error-repository'
import { type AccountModel } from '../../../src/domain/models'

const controllerFactory = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(ok(fakeAccountFactory()))
    }
  }

  return new ControllerStub()
}

const logErrorRepositoryFactory = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stackTrace: string): Promise<void> {

    }
  }

  return new LogErrorRepositoryStub()
}

const fakeServerErrorFactory = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const httpRequestFactory = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const fakeAccountFactory = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

interface SutTypes {
  systemUnderTest: LoggerControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const sutFactory = (): SutTypes => {
  const controllerStub = controllerFactory()
  const logErrorRepositoryStub = logErrorRepositoryFactory()
  const systemUnderTest = new LoggerControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    systemUnderTest,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { systemUnderTest, controllerStub } = sutFactory()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await systemUnderTest.handle(httpRequestFactory())
    expect(handleSpy).toBeCalledWith(httpRequestFactory())
  })

  test('Should return the same result of the controller', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle(httpRequestFactory())
    expect(httpResponse).toEqual(ok(fakeAccountFactory()))
  })

  test('Should call log LogErrorRepository with correct error if controller returns ServerError', async () => {
    const { systemUnderTest, controllerStub, logErrorRepositoryStub } = sutFactory()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      Promise.resolve(fakeServerErrorFactory())
    )
    await systemUnderTest.handle(httpRequestFactory())
    expect(logSpy).toBeCalledWith('any_stack')
  })
})
