import { Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { ConfigService } from 'config/config.service'

@Injectable()
export class HashService {
  private readonly salt: number
  constructor(private config: ConfigService) {
    this.salt = config.getValue('bcrypt:salt')
  }

  async hash(str: string) {
    return bcrypt.hash(str, this.salt)
  }

  async compare(str: string, hash: string) {
    return bcrypt.compare(str, hash)
  }
}
