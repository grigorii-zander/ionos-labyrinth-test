import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersModule } from 'users/users.module'
import { PassportModule } from '@nestjs/passport'
import { HashModule } from 'hash/hash.module'
import { ConfigModule } from 'config/config.module'
import { BasicStrategy } from './basic.strategy'

@Module({
  imports: [ConfigModule, PassportModule, HashModule, UsersModule],
  providers: [AuthService, BasicStrategy],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
