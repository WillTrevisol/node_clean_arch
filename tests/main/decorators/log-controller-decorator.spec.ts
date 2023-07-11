import { type LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { LoggerControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockAccountModel } from '@/tests/domain/mocks'

const controllerFactory = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(ok(mockAccountModel()))
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

type SutTypes = {
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
    expect(httpResponse).toEqual(ok(mockAccountModel()))
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
