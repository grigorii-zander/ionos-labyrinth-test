import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './user.schema'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { PaginatedResponseDto } from 'dto/paginatedResponse.dto'
import { UserDto } from './dto/user.dto'
import { HashService } from 'hash/hash.service'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private hashService: HashService) {}
  async findByLoginWithPassword(login: string) {
    const user = await this.userModel.findOne({ login }).select('+password')
    return user ? user.toObject() : null
  }

  async create(dto: CreateUserDto) {
    const { password, ...data } = dto
    const hashedPw = await this.hashService.hash(password)
    const newUser = new this.userModel({
      schemaVersion: 1,
      password: hashedPw,
      ...data,
    })
    await newUser.save()
    return newUser.toObject()
  }

  async list(limit = 20, offset = 0): Promise<PaginatedResponseDto<User>> {
    const [total, results] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.userModel.find().limit(limit).skip(offset).exec(),
    ])

    return {
      limit,
      offset,
      total,
      results,
    }
  }
}
