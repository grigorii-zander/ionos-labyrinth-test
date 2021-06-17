import { IsInt, IsEnum, IsMongoId } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { TileType } from 'labyrinth/interfaces/tile'
import { Transform } from 'class-transformer'

export class LabyrinthTileUpdateDto {
  @ApiProperty({
    type: String,
    title: 'Labyrinth id',
    required: true,
  })
  @IsMongoId()
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
    enum: ['filled', 'empty'],
    title: 'Y coordinate',
    required: true,
  })
  @IsEnum(['filled', 'empty'])
  type: TileType
}
