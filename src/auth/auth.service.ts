import { Injectable } from '@nestjs/common'
import { User } from 'users/interfaces/user'
import { UsersService } from 'users/users.service'
import { HashService } from 'hash/hash.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private hashService: HashService) {}

  async validateUser(login: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByLoginWithPassword(login)
    if (user) {
      const pwOk = await this.hashService.compare(password, user.password as string)
      if (!pwOk) {
        return null
      }
      const { password: _, ...result } = user
      return result
    }
    return await this.usersService.create({ login, password })
  }
}
