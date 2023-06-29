import request from 'supertest'
import app from '../../../src/main/config/app'
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helpers'
import { type Collection } from 'mongodb'

describe('Survey Routes', () => {
  let surveyCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getColletion('surveys')
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
  })
})
