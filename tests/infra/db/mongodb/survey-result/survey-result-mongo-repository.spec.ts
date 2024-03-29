import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'
import { type AccountModel, type SurveyModel } from '@/domain/models'
import { type Collection } from 'mongodb'
import MockDate from 'mockdate'
import { ObjectId } from 'mongodb'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const sutFactory = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const fakeSurvey = async (): Promise<SurveyModel> => {
  const response = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer_1'
    }, {
      image: 'any_image',
      answer: 'any_answer_2'
    }, {
      image: 'any_image',
      answer: 'any_answer_3'
    }],
    date: new Date()
  })

  return MongoHelper.map(response.ops[0])
}

const fakeAccount = async (): Promise<AccountModel> => {
  const response = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password'
  })

  return MongoHelper.map(response.ops[0])
}

describe('SurveyResultMongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
    MockDate.set(new Date())
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const systemUnderTest = sutFactory()
      const survey = await fakeSurvey()
      const account = await fakeAccount()
      await systemUnderTest.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: account.id
      })
      expect(surveyResult).toBeTruthy()
    })

    test('Should update a survey result if its not new', async () => {
      const systemUnderTest = sutFactory()
      const survey = await fakeSurvey()
      const account = await fakeAccount()
      await surveyResultCollection.insertOne({
        surveyId: ObjectId(survey.id),
        accountId: ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      await systemUnderTest.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })

      const surveyResult = await surveyResultCollection.find({
        surveyId: survey.id,
        accountId: account.id
      }).toArray()

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load a survey result', async () => {
      const systemUnderTest = sutFactory()
      const survey = await fakeSurvey()
      const account = await fakeAccount()
      await surveyResultCollection.insertMany([{
        surveyId: ObjectId(survey.id),
        accountId: ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: ObjectId(survey.id),
        accountId: ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: ObjectId(survey.id),
        accountId: ObjectId(account.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }, {
        surveyId: ObjectId(survey.id),
        accountId: ObjectId(account.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }])
      const surveyResult = await systemUnderTest.loadBySurveyId(survey.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(50)
      expect(surveyResult?.answers[1].count).toBe(2)
      expect(surveyResult?.answers[1].percent).toBe(50)
      expect(surveyResult?.answers[2].count).toBe(0)
      expect(surveyResult?.answers[2].percent).toBe(0)
    })

    test('Should return null if there is no data', async () => {
      const systemUnderTest = sutFactory()
      const survey = await fakeSurvey()
      const surveyResult = await systemUnderTest.loadBySurveyId(survey.id)
      expect(surveyResult).toBeNull()
    })
  })
})
