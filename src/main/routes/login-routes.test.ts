import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helpers'
import request from 'supertest'
import app from '../config/app'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getColletion('accounts')
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
})
