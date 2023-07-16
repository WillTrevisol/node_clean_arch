import { type LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stackTrace: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stackTrace,
      date: new Date()
    })
  }
}
