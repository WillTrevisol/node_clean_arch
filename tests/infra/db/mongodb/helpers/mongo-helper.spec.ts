import { MongoHelper as systemUnderTest } from '@/infra/db/mongodb/helpers/mongo-helpers'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await systemUnderTest.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await systemUnderTest.disconnect()
  })

  test('Should reconnect if mongodb is down', async () => {
    let accountColletion = await systemUnderTest.getCollection('accounts')
    expect(accountColletion).toBeTruthy()
    await systemUnderTest.disconnect()
    accountColletion = await systemUnderTest.getCollection('accounts')
    expect(accountColletion).toBeTruthy()
  })
})
