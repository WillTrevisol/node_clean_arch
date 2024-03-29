import { type SaveSurveyResult } from '@/domain/usecases'
import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const dbSaveSurveyResultFactory = (): SaveSurveyResult => {
  const saveSurveyResultMongoRepository = new SurveyResultMongoRepository()
  const loadSurveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(saveSurveyResultMongoRepository, loadSurveyResultMongoRepository)
}
