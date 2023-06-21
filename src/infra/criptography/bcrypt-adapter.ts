import bcrypt from 'bcrypt'
import { type Hasher } from '../../data/protocols/criptography/hasher'
import { type HashCompare } from '../../data/protocols/criptography/hash-compare'

export class BcryptAdapter implements Hasher, HashCompare {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const encrypedString = await bcrypt.hash(value, this.salt)
    return encrypedString
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
