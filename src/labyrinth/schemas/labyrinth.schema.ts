import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Tile, TileSchema } from './tile.schema'
import { User } from 'users/user.schema'
import { TileType } from 'labyrinth/interfaces/tile'

export type LabyrinthDocument = Labyrinth

@Schema()
export class Labyrinth {
  @Prop({ type: String })
  title?: string

  @Prop({
    type: [TileSchema],
    required: true,
    default: [],
  })
  tiles: Types.DocumentArray<Tile>

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: 1 })
  user: string

  @Prop({ type: Number, select: false })
  __v?: number

  get matrix() {
    return this.getMatrix2d()
  }

  getMatrix2d() {
    const dimension: [number, number] = [0, 0]
    this.tiles.forEach(tile => {
      dimension[0] = Math.max(tile.x, dimension[0])
      dimension[1] = Math.max(tile.y, dimension[1])
    })

    const matrix: number[][] = []

    if (!this.tiles.length) {
      return matrix
    }

    const [x, y] = dimension
    for (let i = 0; i <= y; i++) {
      const row: number[] = []
      for (let j = 0; j <= x; j++) {
        row.push(0)
      }
      matrix.push(row)
    }

    const mapType: Record<TileType, number> = {
      empty: 0,
      filled: 1,
      start: 2,
      end: 3,
    }
    this.tiles.forEach(tile => {
      matrix[tile.y][tile.x] = mapType[tile.type] || 0
    })

    return matrix
  }
}

export const LabyrinthSchema = SchemaFactory.createForClass(Labyrinth)

LabyrinthSchema.index({ 'tiles._id': 1 })
LabyrinthSchema.loadClass(Labyrinth)
