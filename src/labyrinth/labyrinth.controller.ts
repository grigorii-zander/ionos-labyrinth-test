import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  HttpCode,
} from '@nestjs/common'
import { BasicAuthGuard } from 'guards/basic.guard'
import { LabyrinthTileUpdateDto } from 'labyrinth/dto/labyrinth-tile-update.dto'
import { LabyrinthSetStartPointDto } from 'labyrinth/dto/labyrinth-set-start-point.dto'
import { LabyrinthSetEndPointDto } from 'labyrinth/dto/labyrinth-set-end-point.dto'
import { LabyrinthSolutionParamsDto } from 'labyrinth/dto/labyrinth-solution-params.dto'
import { LabyrinthFindOneParamsDto } from 'labyrinth/dto/labyrinth-find-one-params.dto'
import { LabyrinthCreateDto } from 'labyrinth/dto/labyrinth-create.dto'
import { LabyrinthService } from 'labyrinth/labyrinth.service'
import { aStar, Point as AStarPoint } from 'labyrinth/a-star'
import { ApiResponse, ApiBasicAuth, ApiOperation } from '@nestjs/swagger'
import { ApiPaginatedResponse } from 'decorators/apiPaginatedResponse.decorator'
import { LabyrinthDto } from 'labyrinth/dto/labyrinth.dto'
import { LabyrinthSolutionDto } from 'labyrinth/dto/labyrinth-solution.dto'

@ApiBasicAuth()
@UseGuards(BasicAuthGuard)
@Controller('labyrinth')
export class LabyrinthController {
  constructor(private labyrinthService: LabyrinthService) {}

  @Get('/')
  @ApiOperation({ summary: 'Fetch current user maze list.' })
  @ApiPaginatedResponse(LabyrinthDto)
  async getList(@Req() req) {
    return await this.labyrinthService.list(req.user.id, 20, 0)
  }

  @Get('/:id')
  @UseGuards(BasicAuthGuard)
  @ApiOperation({ summary: 'Fetch Labyrinth by id for given user.' })
  @ApiResponse({
    type: LabyrinthDto,
    status: 200,
    description: 'Returns Labyrinth object by given ID',
  })
  async getItem(@Req() req, @Param() params: LabyrinthFindOneParamsDto) {
    const item = await this.labyrinthService.getById(req.user.id, params.id)
    if (!item) {
      throw new NotFoundException('Labyrinth with given ID not found.')
    }
    return item
  }

  @Post('/')
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new Labyrinth' })
  @ApiResponse({
    type: LabyrinthDto,
    status: 201,
    description: 'Returns created Labyrinth.',
  })
  async create(@Body() body: LabyrinthCreateDto, @Req() req) {
    return this.labyrinthService.create(req.user.id, body)
  }

  @Put('/:id/playfield/:x/:y/:type')
  @UseGuards(BasicAuthGuard)
  @ApiOperation({
    summary: 'Set cell type',
    description: 'Set cell type by given coordinates. Accepted types: "filled" and "empty"',
  })
  async setCell(@Req() req, @Param() params: LabyrinthTileUpdateDto) {
    const updatedLabyrinth = await this.labyrinthService.setTile(req.user.id, params.id, params)
    if (!updatedLabyrinth) {
      throw new NotFoundException('Labyrinth not found.')
    }
    return updatedLabyrinth
  }

  @Put('/:id/start/:x/:y')
  @UseGuards(BasicAuthGuard)
  @ApiOperation({
    summary: 'Set starting point of Labyrinth',
    description:
      'Set cell type to type "start" by given coordinates. If start point already existed it will be removed before inserting new one',
  })
  async setStartPoint(@Req() req, @Param() params: LabyrinthSetStartPointDto) {
    const updatedLabyrinth = await this.labyrinthService.setStartPoint(req.user.id, params.id, params)
    if (!updatedLabyrinth) {
      throw new NotFoundException('Labyrinth not found.')
    }
    return updatedLabyrinth
  }

  @Put(`/:id/end/:x/:y`)
  @UseGuards(BasicAuthGuard)
  @ApiOperation({
    summary: 'Set ending point of Labyrinth',
    description:
      'Set cell type to type "end" by given coordinates. If start point already existed it will be removed before inserting new one',
  })
  async setEndPoint(@Req() req, @Param() params: LabyrinthSetEndPointDto) {
    const updatedLabyrinth = await this.labyrinthService.setEndPoint(req.user.id, params.id, params)
    if (!updatedLabyrinth) {
      throw new NotFoundException('Labyrinth not found.')
    }
    return updatedLabyrinth
  }

  @Get('/:id/solution')
  @UseGuards(BasicAuthGuard)
  @ApiOperation({
    summary: 'try to solve the Labyrinth',
  })
  @ApiResponse({
    status: 200,
    description: 'Solves the Labyrinth',
    type: LabyrinthSolutionDto,
  })
  async getSolution(@Req() req, @Param() params: LabyrinthSolutionParamsDto) {
    const labyrinth = await this.labyrinthService.getById(req.user.id, params.id)
    if (!labyrinth) {
      throw new NotFoundException('Labyrinth not found.')
    }
    const matrix = labyrinth.matrix
    if (!matrix.length) {
      throw new BadRequestException('The labyrinth is empty.')
    }
    const h = matrix.length
    const w = matrix[0].length

    const grid: AStarPoint[][] = []
    let startPoint: AStarPoint | null = null
    let endPoint: AStarPoint | null = null

    for (let i = 0; i < h; i++) {
      const row: AStarPoint[] = []
      for (let j = 0; j < w; j++) {
        const pointType = matrix[i][j]
        const point = new AStarPoint(grid)
        point.i = i
        point.j = j

        switch (pointType) {
          case 1:
            point.isWall = true
            break
          case 2:
            startPoint = point
            break
          case 3:
            endPoint = point
            break
          case 0:
            break
          default:
            // just skip unknown points
            continue
        }

        row.push(point)
      }
      grid.push(row)
    }

    if (!startPoint) {
      throw new BadRequestException('The labyrinth have no starting point.')
    }
    if (!endPoint) {
      throw new BadRequestException('The labyrinth have no ending point.')
    }

    const path = aStar(grid, startPoint, endPoint)
    if (!path) {
      return null
    }

    const mapDirection = {
      down: '⬇️',
      up: '⬆️',
      left: '⬅️',
      right: '➡️',
    }

    path.forEach(entry => {
      matrix[entry.point.i][entry.point.j] = mapDirection[entry.direction]
    })

    return {
      path: path.map(entry => entry.direction),
      matrix,
    }
  }
}
