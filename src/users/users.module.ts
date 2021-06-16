import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './user.schema'
import { HashModule } from 'hash/hash.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), HashModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
