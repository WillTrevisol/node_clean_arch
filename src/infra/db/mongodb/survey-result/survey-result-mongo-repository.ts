import { type SaveSurveyResultParams, type SurveyResultModel, type SaveSurveyResultRepository } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getColletion('surveyResults')
    const response = await surveyResultCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        data: data.date
      }
    }, {
      upsert: true,
      returnOriginal: false
    })

    return MongoHelper.map(response.value)
  }
}
