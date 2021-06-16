import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { LabyrinthSchema, LabyrinthModel, LabyrinthDocument } from './schemas/labyrinth.schema'
import { Model } from 'mongoose'
import { LabyrinthCreateDto } from 'labyrinth/dto/labyrinth-create.dto'
import { LabyrinthTileUpdateDto } from 'labyrinth/dto/labyrinth-tile-update.dto'
import { TileType } from 'labyrinth/interfaces/tile'
import { PaginatedResponseDto } from 'dto/paginatedResponse.dto'
import { TileDocument, TileModel } from 'labyrinth/schemas/tile.schema'
import { UserModel } from 'users/user.schema'

@Injectable()
export class LabyrinthService {
  constructor(
    @InjectModel(LabyrinthModel.name) private labyrinthModel: Model<LabyrinthDocument>,
    @InjectModel(TileModel.name) private tileModel: Model<TileDocument>
  ) {}

  async list(userId: string, limit = 20, offset = 0): Promise<PaginatedResponseDto<LabyrinthModel>> {
    const [total, results] = await Promise.all([
      this.labyrinthModel.countDocuments().exec(),
      this.labyrinthModel.find().limit(limit).skip(offset).populate(['tiles', 'user']).exec(),
    ])

    return {
      limit,
      offset,
      total,
      results,
    }
  }

  async create(userId: string, definition: LabyrinthCreateDto) {
    const { tiles, title } = definition

    const model = await this.labyrinthModel.create({
      title,
      user: userId,
    })

    if (tiles) {
      const newTiles = await this.tileModel.insertMany(tiles)
      model.tiles = newTiles.map(tile => tile._id)
    }

    await model.save()

    return model.toObject()
  }

  async setTile(userId, labyrinthId: string, definition: { x: number; y: number; type: TileType }) {
    const model = await this.labyrinthModel.findOne({ _id: labyrinthId })
    if (!model) {
      return null
    }

    const newTile = await this.tileModel.create(definition)
    await newTile.save()
    model.tiles.push(newTile)
    await model.save()

    return model.toObject()
  }
}
