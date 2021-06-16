import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User

@Schema()
export class User extends Document {
  @Prop({ type: Number, required: true, select: false })
  schemaVersion = 1

  @Prop({ type: String, required: true, unique: true, index: true })
  login: string

  @Prop({ type: String, required: true, select: false })
  password: string

  @Prop({ type: Number, select: false })
  __v: number
}

export const UserSchema = SchemaFactory.createForClass(User)
