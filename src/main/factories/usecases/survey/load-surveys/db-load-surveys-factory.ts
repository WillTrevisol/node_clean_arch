import { DbLoadSurveys } from '../../../../../data/usecases/load-surveys/db-load-surveys'
import { type LoadSurveys } from '../../../../../domain/usecases'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const dbLoadSurveysFactory = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
