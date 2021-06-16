import { IsMongoId } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LabyrinthSolutionParamsDto {
  @ApiProperty({
    type: String,
    title: 'Labyrinth id',
    required: true,
  })
  @IsMongoId()
  id: string
}
