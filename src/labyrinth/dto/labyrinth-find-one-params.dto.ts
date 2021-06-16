import { IsMongoId } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LabyrinthFindOneParamsDto {
  @ApiProperty({
    type: String,
    title: 'Labyrinth id',
    required: true,
  })
  @IsMongoId()
  id: string
}
