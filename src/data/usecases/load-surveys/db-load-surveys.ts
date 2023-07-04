import { type LoadSurveys } from '../../../domain/usecases'
import { type SurveyModel } from '../../../domain/models'
import { type LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll()
    return surveys
  }
}
