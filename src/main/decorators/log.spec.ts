import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'
import { LoggerControllerDecorator } from './log'

interface SutTypes {
  systemUnderTest: LoggerControllerDecorator
  controllerStub: Controller
}

const controllerFactory = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 204,
        body: {}
      }
      return Promise.resolve(httpResponse)
    }
  }

  return new ControllerStub()
}

const sutFactory = (): SutTypes => {
  const controllerStub = controllerFactory()
  const systemUnderTest = new LoggerControllerDecorator(controllerStub)

  return {
    systemUnderTest,
    controllerStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { systemUnderTest, controllerStub } = sutFactory()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await systemUnderTest.handle(httpRequest)

    expect(handleSpy).toBeCalledWith(httpRequest)
  })
})
