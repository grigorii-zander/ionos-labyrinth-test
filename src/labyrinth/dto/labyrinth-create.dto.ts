import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LabyrinthCreateDto {
  @ApiProperty({
    type: String,
    title: 'Labyrinth title (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string
}
