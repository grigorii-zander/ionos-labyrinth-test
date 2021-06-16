import { IsInt, IsString, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { TileType, tileTypesEnum } from 'labyrinth/interfaces/tile'
import { Transform } from 'class-transformer'

export class LabyrinthTileUpdateDto {
  @ApiProperty({
    type: String,
    title: 'Labyrinth id',
    required: true,
  })
  @IsString()
  id: string

  @ApiProperty({
    type: Number,
    title: 'X coordinate',
    required: true,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  x: number

  @ApiProperty({
    type: Number,
    title: 'Y coordinate',
    required: true,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  y: number

  @ApiProperty({
    type: String,
    enum: tileTypesEnum,
    title: 'Y coordinate',
    required: true,
  })
  @IsEnum(tileTypesEnum)
  type: TileType
}