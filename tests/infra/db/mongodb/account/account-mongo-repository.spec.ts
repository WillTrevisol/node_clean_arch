import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'
import { mockAddAccountParams } from '@/tests/domain/mocks'
import { type Collection } from 'mongodb'

describe('Account Mongo Repository', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
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
      const account = await systemUnderTest.add(mockAddAccountParams())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const systemUnderTest = sutFactory()
      await accountCollection.insertOne(mockAddAccountParams())
      const account = await systemUnderTest.loadByEmail('any_email@mail.com')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
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
      const result = await accountCollection.insertOne(mockAddAccountParams())
      const resultAccount = result.ops[0]
      expect(resultAccount.accessToken).toBeFalsy()
      await systemUnderTest.updateAccessToken(resultAccount._id, 'any_token')
      const account = await accountCollection.findOne({ _id: resultAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const systemUnderTest = sutFactory()
      await accountCollection.insertOne(Object.assign({}, mockAddAccountParams(), { accessToken: 'any_token' }))
      const account = await systemUnderTest.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const systemUnderTest = sutFactory()
      await accountCollection.insertOne(Object.assign({}, mockAddAccountParams(), {
        accessToken: 'any_token',
        role: 'admin'
      }))
      const account = await systemUnderTest.loadByToken('any_token', 'admin')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const systemUnderTest = sutFactory()
      await accountCollection.insertOne(Object.assign({}, mockAddAccountParams(), { accessToken: 'any_token' }))
      const account = await systemUnderTest.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const systemUnderTest = sutFactory()
      await accountCollection.insertOne(Object.assign({}, mockAddAccountParams(), {
        accessToken: 'any_token',
        role: 'admin'
      }))
      const account = await systemUnderTest.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })

    test('Should return null if loadByToken fails', async () => {
      const systemUnderTest = sutFactory()
      const account = await systemUnderTest.loadByEmail('any_token')

      expect(account).toBeFalsy()
    })
  })
})
