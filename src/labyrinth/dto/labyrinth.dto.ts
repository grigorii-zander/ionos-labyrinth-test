import { IsArray, IsMongoId, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { TileDto } from 'labyrinth/dto/tile.dto'

export class LabyrinthDto {
  @ApiProperty({
    type: String,
    description: 'Labyrinth id',
    required: true,
  })
  @IsMongoId()
  id: string

  @ApiProperty({
    type: [Number],
    description: '2D Matrix representation of labyrinth',
    required: true,
  })
  @IsArray()
  matrix: number[][]

  @ApiProperty({
    type: [TileDto],
    description: 'Tiles list',
    required: true,
  })
  tiles: TileDto[]

  @ApiProperty({
    type: String,
    description: 'User ID',
    required: true,
  })
  @IsMongoId()
  user: string

  @ApiProperty({
    type: String,
    description: 'Title of given labyrinth',
    required: false,
  })
  @IsString()
  title?: string
}
