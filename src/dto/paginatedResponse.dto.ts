import { ApiProperty } from '@nestjs/swagger'

export class PaginatedResponseDto<T> {
  @ApiProperty()
  total: number

  @ApiProperty()
  limit: number

  @ApiProperty()
  offset: number

  results: T[]
}
