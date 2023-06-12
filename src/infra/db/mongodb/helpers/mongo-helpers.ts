import { type Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  mongoClient: undefined as unknown as MongoClient,
  uri: undefined as unknown as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.mongoClient = await MongoClient.connect(
      uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
  },

  async disconnect (): Promise<void> {
    await this.mongoClient.close()
    this.mongoClient = undefined
  },

  async getColletion (name: string): Promise<Collection> {
    if (!this.mongoClient?.isConnected()) {
      await this.connect(this.uri)
    }
    return this.mongoClient.db().collection(name)
  },

  map: (document: any): any => {
    const { _id, ...documentWithoutId } = document
    return Object.assign({}, documentWithoutId, { id: _id })
  }
}
