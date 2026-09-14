import { Test, TestingModule } from '@nestjs/testing';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';
import { AuthGuard } from '../auth/auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('TimerController', () => {
  let controller: TimerController;
  let service: TimerService;

  const mockTimerService = {
    logTime: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimerController],
      providers: [
        {
          provide: TimerService,
          useValue: mockTimerService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { email: 'test@example.com' };
          return true;
        },
      })
      .compile();

    controller = module.get<TimerController>(TimerController);
    service = module.get<TimerService>(TimerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('logTime', () => {
    it('should log time and return success', async () => {
      const mockResult = { id: 'tl1', ticketId: 't1', projectId: 'p1', durationSeconds: 3600, userEmail: 'test@example.com' };
      mockTimerService.logTime.mockResolvedValue(mockResult);

      const req = { user: { email: 'test@example.com' } };
      const body = { ticketId: 't1', projectId: 'p1', durationSeconds: 3600 };
      const result = await controller.logTime(req as any, body);

      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
      expect(service.logTime).toHaveBeenCalledWith('test@example.com', 't1', 'p1', 3600);
    });
  });
});
