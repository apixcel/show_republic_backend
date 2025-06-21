import { Test, TestingModule } from '@nestjs/testing';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';

describe('GamificationController', () => {
  let gamificationController: GamificationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GamificationController],
      providers: [GamificationService],
    }).compile();

    gamificationController = app.get<GamificationController>(GamificationController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(gamificationController.getHello()).toBe('Hello World!');
    });
  });
});
