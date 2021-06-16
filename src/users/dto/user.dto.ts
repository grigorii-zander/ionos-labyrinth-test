import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '../interfaces/user'

export class UserDto implements Omit<User, 'id'> {
  @ApiProperty({
    title: 'User login',
    type: String,
  })
  @IsString()
  login: string
}
