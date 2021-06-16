import { Module } from '@nestjs/common'
import { LabyrinthController } from './labyrinth.controller'
import { LabyrinthService } from './labyrinth.service'
import { MongooseModule } from '@nestjs/mongoose'
import { LabyrinthSchema } from 'labyrinth/schemas/labyrinth.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Labyrinth', schema: LabyrinthSchema }])],
  controllers: [LabyrinthController],
  providers: [LabyrinthService],
})
export class LabyrinthModule {}
