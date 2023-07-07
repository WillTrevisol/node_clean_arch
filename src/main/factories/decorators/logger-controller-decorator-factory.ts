import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { LoggerControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { type Controller } from '@/presentation/protocols'

export const loggerControllerDecoratorFactory = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LoggerControllerDecorator(controller, logMongoRepository)
}
