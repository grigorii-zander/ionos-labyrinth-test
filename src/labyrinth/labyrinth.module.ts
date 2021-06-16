import { Module } from '@nestjs/common'
import { LabyrinthController } from './labyrinth.controller'
import { LabyrinthService } from './labyrinth.service'
import { MongooseModule } from '@nestjs/mongoose'
import { LabyrinthSchema } from 'labyrinth/schemas/labyrinth.schema'
import { TileSchema } from 'labyrinth/schemas/tile.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'LabyrinthModel', schema: LabyrinthSchema }]),
    MongooseModule.forFeature([{ name: 'TileModel', schema: TileSchema }]),
  ],
  controllers: [LabyrinthController],
  providers: [LabyrinthService],
})
export class LabyrinthModule {}
