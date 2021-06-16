import { Test, TestingModule } from '@nestjs/testing'
import { LabyrinthService } from './labyrinth.service'

describe('LabyrinthService', () => {
  let service: LabyrinthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LabyrinthService],
    }).compile()

    service = module.get<LabyrinthService>(LabyrinthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
