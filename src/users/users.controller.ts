import { Body, Controller, Get, Post, Query, Logger } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { PagingDto } from 'dto/paging.dto'
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger'
import { PaginatedResponseDto } from 'dto/paginatedResponse.dto'
import { ApiPaginatedResponse } from 'decorators/apiPaginatedResponse.decorator'
import { UserDto } from './dto/user.dto'

@Controller('users')
@ApiExtraModels(PaginatedResponseDto)
export class UsersController {
  constructor(private usersService: UsersService, private logger: Logger) {}

  @Post()
  @ApiResponse({ type: CreateUserDto, description: 'User successfully created', status: 201 })
  async create(@Body() params: CreateUserDto) {
    return this.usersService.create(params)
  }

  @Get()
  @ApiPaginatedResponse(UserDto)
  async list(@Query() query: PagingDto) {
    return this.usersService.list(query.limit, query.offset)
  }
}
