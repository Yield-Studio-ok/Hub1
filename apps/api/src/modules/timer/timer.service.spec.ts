import { Test, TestingModule } from '@nestjs/testing';
import { TimerService } from './timer.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PlaneService } from '../plane/plane.service';

describe('TimerService', () => {
  let service: TimerService;
  let prismaService: PrismaService;
  let planeService: PlaneService;

  const mockPrismaService = {
    timeLog: {
      create: jest.fn(),
    },
  };

  const mockPlaneService = {
    addCommentToIssue: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimerService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PlaneService,
          useValue: mockPlaneService,
        },
      ],
    }).compile();

    service = module.get<TimerService>(TimerService);
    prismaService = module.get<PrismaService>(PrismaService);
    planeService = module.get<PlaneService>(PlaneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logTime', () => {
    it('should save to db and send comment to plane', async () => {
      mockPrismaService.timeLog.create.mockResolvedValue({ id: 'tl1' });
      mockPlaneService.addCommentToIssue.mockResolvedValue(true);

      const result = await service.logTime('test@example.com', 't1', 'p1', 3600);

      expect(result).toEqual({ id: 'tl1' });
      expect(prismaService.timeLog.create).toHaveBeenCalledWith({
        data: {
          ticketId: 't1',
          projectId: 'p1',
          durationSeconds: 3600,
          userEmail: 'test@example.com',
        },
      });
      expect(planeService.addCommentToIssue).toHaveBeenCalledWith('p1', 't1', 'Logged 1h 0m of work.');
    });
  });
});
