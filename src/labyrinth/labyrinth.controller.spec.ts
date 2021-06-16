import { Test, TestingModule } from '@nestjs/testing'
import { LabyrinthController } from './labyrinth.controller'

describe('LabyrinthController', () => {
  let controller: LabyrinthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabyrinthController],
    }).compile()

    controller = module.get<LabyrinthController>(LabyrinthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
