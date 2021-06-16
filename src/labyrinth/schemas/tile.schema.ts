import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { TileType, tileTypesEnum } from 'labyrinth/interfaces/tile'

export type TileDocument = Tile

@Schema()
export class Tile extends Document {
  @Prop({ type: Number, required: true })
  x: number
  @Prop({ type: Number, required: true })
  y: number

  @Prop({ enum: tileTypesEnum, required: true })
  type: TileType

  @Prop({ type: Number, select: false })
  __v?: number
}

export const TileSchema = SchemaFactory.createForClass(Tile)

TileSchema.index({ x: 1, y: 1 })
