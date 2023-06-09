import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { DbAddSurvey } from '@/data/usecases/survey/add-survey/db-add-survey'
import { type AddSurvey } from '@/domain/usecases'

export const dbAddSurveyFactory = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
