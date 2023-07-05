import { MongoHelper } from '../../../../../src/infra/db/mongodb/helpers/mongo-helpers'
import { SurveyMongoRepository } from '../../../../../src/infra/db/mongodb/survey/survey-mongo-repository'
import { type Collection } from 'mongodb'
import MockDate from 'mockdate'

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
    MockDate.set(new Date())
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getColletion('surveys')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  const sutFactory = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  describe('add()', () => {
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

  describe('loadAll()', () => { 
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_ answer'
        }],
        date: new Date()
      }, {
        question: 'another_question',
        answers: [{
          image: 'another_image',
          answer: 'another_ answer'
        }],
        date: new Date()
      }])
      const systemUnderTest = sutFactory()
      const surveys = await systemUnderTest.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('another_question')
    })

    test('Should load empty list', async () => {
      const systemUnderTest = sutFactory()
      const surveys = await systemUnderTest.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
})
