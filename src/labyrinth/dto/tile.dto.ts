import { IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { TileType, tileTypesEnum } from 'labyrinth/interfaces/tile'

export class TileDto {
  @ApiProperty({
    type: Number,
    title: 'Tile X coordinate',
    required: true,
  })
  @IsInt()
  x: number
  @ApiProperty({
    type: Number,
    title: 'Tile Y coordinate',
    required: true,
  })
  @IsInt()
  y: number

  @ApiProperty({
    title: 'Tile type',
    enum: tileTypesEnum,
    required: true,
  })
  type: TileType
}
