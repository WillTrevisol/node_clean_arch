import { type LoadSurveyResult } from '@/domain/usecases'
import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const dbLoadSurveyResultFactory = (): LoadSurveyResult => {
  const saveSurveyResultMongoRepository = new SurveyResultMongoRepository()
  const loadSurveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResult(saveSurveyResultMongoRepository, loadSurveyMongoRepository)
}
