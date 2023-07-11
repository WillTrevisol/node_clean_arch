import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'
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
          answer: 'any_answer'
        }],
        date: new Date()
      }, {
        question: 'another_question',
        answers: [{
          image: 'another_image',
          answer: 'another_answer'
        }],
        date: new Date()
      }])
      const systemUnderTest = sutFactory()
      const surveys = await systemUnderTest.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('another_question')
    })

    test('Should load empty list', async () => {
      const systemUnderTest = sutFactory()
      const surveys = await systemUnderTest.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const response = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_ answer'
        }],
        date: new Date()
      })
      const systemUnderTest = sutFactory()
      const survey = await systemUnderTest.loadById(response.ops[0]._id)
      expect(survey).toBeTruthy()
      expect(survey?.id).toBeTruthy()
    })
  })
})
