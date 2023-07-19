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
    password: 'any_password'
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

describe('SurveyResult Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken', async () => {
      const accessToken = await accessTokenFactory()
      const response = await surveyCollection.insertOne({
        question: 'question',
        answers: [{
          answer: 'answer',
          image: 'http://image.com'
        },{
          answer: 'answer 2'
        }],
        date: new Date()
      })
      await request(app)
        .put(`/api/surveys/${response.ops[0]._id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'answer'
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })
  })
})
