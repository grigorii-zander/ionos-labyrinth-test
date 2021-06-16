import { Controller, Get, Post, Put, Req, UseGuards, Param, Body } from '@nestjs/common'
import { BasicAuthGuard } from 'guards/basic.guard'
import { LabyrinthTileUpdateDto } from 'labyrinth/dto/labyrinth-tile-update.dto'
import { LabyrinthSetStartPointDto } from 'labyrinth/dto/labyrinth-set-start-point.dto'
import { LabyrinthSetEndPointDto } from 'labyrinth/dto/labyrinth-set-end-point.dto'
import { LabyrinthSolutionParamsDto } from 'labyrinth/dto/labyrinth-solution-params.dto'
import { LabyrinthFindOneParamsDto } from 'labyrinth/dto/labyrinth-find-one-params.dto'
import { LabyrinthCreateDto } from 'labyrinth/dto/labyrinth-create.dto'
import { LabyrinthService } from 'labyrinth/labyrinth.service'

@Controller('labyrinth')
export class LabyrinthController {
  constructor(private labyrinthService: LabyrinthService) {}

  @Get('/')
  @UseGuards(BasicAuthGuard)
  async getList(@Req() req) {
    return await this.labyrinthService.list(req.user._id, 20, 0)
  }

  @Get('/:id')
  @UseGuards(BasicAuthGuard)
  async getItem(@Req() req, @Param() params: LabyrinthFindOneParamsDto) {
    console.log(params)
  }

  @Post('/')
  @UseGuards(BasicAuthGuard)
  async create(@Body() body: LabyrinthCreateDto, @Req() req) {
    const labyrinth = await this.labyrinthService.create(req.user._id, body)
    return labyrinth
  }

  @Put('/:id/playfield/:x/:y/:type')
  @UseGuards(BasicAuthGuard)
  async setCell(@Req() req, @Param() params: LabyrinthTileUpdateDto) {
    return await this.labyrinthService.setTile(req.user._id, params.id, params)
  }

  @Put(`/:id/start/:x/:y`)
  @UseGuards(BasicAuthGuard)
  async setStartPoint(@Req() req, @Param() params: LabyrinthSetStartPointDto) {}

  @Put(`/:id/end/:x/:y`)
  @UseGuards(BasicAuthGuard)
  async setEndPoint(@Req() req, @Param() params: LabyrinthSetEndPointDto) {}

  @Get('/:id')
  @UseGuards(BasicAuthGuard)
  async getSolution(@Req() req, @Param() params: LabyrinthSolutionParamsDto) {}
}
