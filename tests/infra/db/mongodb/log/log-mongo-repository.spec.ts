import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'
import { type Collection } from 'mongodb'

const sutFactory = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should create an error log on success', async () => {
    const systemUnderTest = sutFactory()
    await systemUnderTest.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
