import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { TileDto } from 'labyrinth/dto/tile.dto'

export class LabyrinthCreateDto {
  @ApiProperty({
    type: String,
    title: 'Labyrinth title (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({
    type: TileDto,
    title: 'Initial tile list (optional)',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TileDto)
  @IsOptional()
  tiles?: TileDto[] = []
}
