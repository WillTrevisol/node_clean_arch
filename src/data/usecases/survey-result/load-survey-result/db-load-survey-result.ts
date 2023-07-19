import { type SurveyResultModel, type LoadSurveyResult, type LoadSurveyResultRepository } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}
  async load (surveyId: string): Promise<SurveyResultModel | null> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    return Promise.resolve(null)
  }
}
