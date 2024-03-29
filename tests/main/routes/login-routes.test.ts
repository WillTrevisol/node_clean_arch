import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'
import app from '@/main/config/app'
import { type Collection } from 'mongodb'
import request from 'supertest'
import { hash } from 'bcrypt'

describe('Login Routes', () => {
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

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'user_name',
          email: 'mail@gmail.com',
          password: '1234',
          passwordConfirmation: '1234'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('1234', 12)
      await accountCollection.insertOne({
        name: 'user_name',
        email: 'mail@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'mail@gmail.com',
          password: '1234'
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'mail@gmail.com',
          password: '1234'
        })
        .expect(401)
    })
  })
})
