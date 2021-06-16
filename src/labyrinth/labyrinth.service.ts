import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Labyrinth, LabyrinthDocument } from './schemas/labyrinth.schema'
import { Model } from 'mongoose'
import { LabyrinthCreateDto } from 'labyrinth/dto/labyrinth-create.dto'
import { TileType } from 'labyrinth/interfaces/tile'
import { PaginatedResponseDto } from 'dto/paginatedResponse.dto'

@Injectable()
export class LabyrinthService {
  constructor(@InjectModel(Labyrinth.name) private labyrinthModel: Model<LabyrinthDocument>, private logger: Logger) {}

  private insertOrUpdateTile(labyrinthDoc: LabyrinthDocument, definition: { x: number; y: number; type: TileType }) {
    const existed = labyrinthDoc.tiles.find(tile => tile.y === definition.y && tile.x === definition.x)
    if (existed) {
      existed.type = definition.type
    } else {
      labyrinthDoc.tiles.push(definition)
    }
    return labyrinthDoc
  }

  async list(userId: string, limit = 20, offset = 0): Promise<PaginatedResponseDto<Labyrinth>> {
    const [total, results] = await Promise.all([
      this.labyrinthModel.countDocuments().exec(),
      this.labyrinthModel.find({ user: userId }).limit(limit).skip(offset).exec(),
    ])

    return {
      limit,
      offset,
      total,
      results,
    }
  }

  async create(userId: string, definition: LabyrinthCreateDto) {
    const doc = await this.labyrinthModel.create({
      ...definition,
      user: userId,
    })
    return doc.toObject()
  }

  async getById(userId: string, labyrinthId: string) {
    try {
      const doc = await this.labyrinthModel.findOne({ user: userId, _id: labyrinthId }).exec()
      if (doc) {
        return doc.toObject()
      }
    } catch (err) {
      this.logger.error(err)
      return null
    }
    return null
  }

  async setTile(userId: string, labyrinthId: string, definition: { x: number; y: number; type: TileType }) {
    try {
      const labyrinthDoc = await this.labyrinthModel.findOne({ _id: labyrinthId, user: userId })
      if (!labyrinthDoc) {
        return null
      }
      this.insertOrUpdateTile(labyrinthDoc, definition)
      await labyrinthDoc.save()
      return labyrinthDoc.toObject()
    } catch (err) {
      this.logger.error(err)
    }
    return null
  }

  async setStartPoint(userId: string, labyrinthId: string, definition: { x: number; y: number }) {
    try {
      const labyrinthDoc = await this.labyrinthModel.findOne({ user: userId, _id: labyrinthId }).exec()
      if (!labyrinthDoc) {
        return null
      }
      // ensure no more start points
      labyrinthDoc.tiles.forEach(t => {
        if (t.type === 'start') {
          t.remove()
        }
      })
      this.insertOrUpdateTile(labyrinthDoc, { ...definition, type: 'start' })

      await labyrinthDoc.save()
      return labyrinthDoc.toObject()
    } catch (err) {
      this.logger.error(err)
    }
    return null
  }

  async setEndPoint(userId: string, labyrinthId: string, definition: { x: number; y: number }) {
    try {
      const labyrinthDoc = await this.labyrinthModel.findOne({ user: userId, _id: labyrinthId })
      if (!labyrinthDoc) {
        return null
      }

      // ensure no more end points
      labyrinthDoc.tiles.forEach(t => {
        if (t.type === 'end') {
          t.remove()
        }
      })
      this.insertOrUpdateTile(labyrinthDoc, { ...definition, type: 'end' })

      await labyrinthDoc.save()
      return labyrinthDoc.toObject()
    } catch (err) {
      this.logger.error(err)
    }
    return null
  }
}
