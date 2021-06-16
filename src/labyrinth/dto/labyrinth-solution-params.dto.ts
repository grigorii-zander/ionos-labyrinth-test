import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LabyrinthSolutionParamsDto {
  @ApiProperty({
    type: String,
    title: 'Labyrinth id',
    required: true,
  })
  @IsString()
  id: string
}
