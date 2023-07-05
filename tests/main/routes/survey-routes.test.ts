import request from 'supertest'
import { sign } from 'jsonwebtoken'
import env from '../../../src/main/config/env'
import app from '../../../src/main/config/app'
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helpers'
import { type Collection } from 'mongodb'

describe('Survey Routes', () => {
  let surveyCollection: Collection
  let accountCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getColletion('surveys')
    accountCollection = await MongoHelper.getColletion('accounts')
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
            answer: 'answer 2',
          }]
        })
        .expect(403)
    })

    test('Should return 204 with valid token', async () => {
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
            answer: 'answer 2',
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

    test('Should return 200 on load surveys with valid token', async () => {
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
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_ answer'
        }],
        date: new Date()
      }])
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .send()
        .expect(200)
    })
  })
})
