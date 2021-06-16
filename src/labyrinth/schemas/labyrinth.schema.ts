import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { TileModel, TileSchema } from './tile.schema'
import { UserModel } from 'users/user.schema'

export type LabyrinthDocument = Document & LabyrinthModel

@Schema({ minimize: true })
export class LabyrinthModel {
  @Prop({ type: String })
  title?: string

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'TileModel' }],
    default: [],
  })
  tiles: TileModel[]

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserModel', required: true, index: true })
  user: UserModel

  @Prop({ type: Number, select: false })
  __v?: number
}

export const LabyrinthSchema = SchemaFactory.createForClass(LabyrinthModel)
