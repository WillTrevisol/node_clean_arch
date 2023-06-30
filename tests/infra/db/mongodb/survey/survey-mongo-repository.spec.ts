import { MongoHelper } from '../../../../../src/infra/db/mongodb/helpers/mongo-helpers'
import { SurveyMongoRepository } from '../../../../../src/infra/db/mongodb/survey/survey-mongo-repository'
import { type Collection } from 'mongodb'

describe('Survey Mongo Repository', () => {
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

  const sutFactory = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  test('Should add a survey on success', async () => {
    const systemUnderTest = sutFactory()
    await systemUnderTest.add({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_ answer'
      },
      {
        answer: 'another_ answer'
      }],
      date: new Date()
    })

    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
