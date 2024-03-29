import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'
import env from '@/main/config/env'
import app from '@/main/config/app'
import { type Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection

const accessTokenFactory = async (): Promise<string> => {
  const response = await accountCollection.insertOne({
    name: 'user_name',
    email: 'mail@gmail.com',
    password: 'any_password',
    role: 'admin'
  })
  const id = response.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'question',
          answers: [{
            answer: 'answer',
            image: 'http://image.com'
          },
          {
            answer: 'answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 with valid token', async () => {
      const accessToken = await accessTokenFactory()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'question',
          answers: [{
            answer: 'answer',
            image: 'http://image.com'
          },
          {
            answer: 'answer 2'
          }]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 204 on load surveys with valid token', async () => {
      const accessToken = await accessTokenFactory()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .send()
        .expect(204)
    })
  })
})
