import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '../interfaces/user'

export class CreateUserDto implements Omit<User, 'id'> {
  @ApiProperty({
    title: 'User login',
    type: String,
  })
  @IsString()
  login: string

  @ApiProperty({
    title: 'Password',
    type: String,
  })
  @IsString()
  password: string
}
