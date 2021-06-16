import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { TileType, tileTypesEnum } from 'labyrinth/interfaces/tile'

export type TileDocument = Document & TileModel

@Schema()
export class TileModel {
  @Prop({ type: Number, required: true })
  x: number
  @Prop({ type: Number, required: true })
  y: number

  @Prop({ enum: tileTypesEnum })
  type: TileType

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Labyrinths', required: true })

  @Prop({ type: Number, select: false })
  __v?: number
}

export const TileSchema = SchemaFactory.createForClass(TileModel)

TileSchema.index({ x: 1, y: 1 }, { unique: true })
