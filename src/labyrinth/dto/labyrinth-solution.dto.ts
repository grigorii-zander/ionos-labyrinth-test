import { IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LabyrinthSolutionDto {
  @ApiProperty({
    type: [String],
    description: '2D Matrix of the Labyrinth with emoji market path ➡️⬅️⬆️⬇️✨',
    required: true,
  })
  @IsArray()
  matrix: (string | number)[][]

  @ApiProperty({
    enum: ['left', 'right', 'top', 'bottom'],
    type: [String],
    description: '2D Matrix representation of labyrinth',
    required: true,
  })
  path: string[]
}
