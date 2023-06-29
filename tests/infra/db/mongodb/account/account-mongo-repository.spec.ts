import { MongoHelper } from '../../../../../src/infra/db/mongodb/helpers/mongo-helpers'
import { AccountMongoRepository } from '../../../../../src/infra/db/mongodb/account/account-mongo-repository'
import { type Collection } from 'mongodb'

describe('Account Mongo Repository', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getColletion('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const sutFactory = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const systemUnderTest = sutFactory()
      const account = await systemUnderTest.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
  
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail', () => {
    test('Should return an account on loadByEmail success', async () => {
      const systemUnderTest = sutFactory()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const account = await systemUnderTest.loadByEmail('any_email@mail.com')
  
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  
    test('Should return null if loadByEmail fails', async () => {
      const systemUnderTest = sutFactory()
      const account = await systemUnderTest.loadByEmail('any_email@mail.com')
  
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const systemUnderTest = sutFactory()
      const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const resultAccount = result.ops[0]
      expect(resultAccount.accessToken).toBeFalsy()
      await systemUnderTest.updateAccessToken(resultAccount._id, 'any_token')
      const account = await accountCollection.findOne({ _id: resultAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })
})
