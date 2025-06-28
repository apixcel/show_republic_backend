import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChallengeDto } from '@show-republic/dtos';
import { GameficationService } from './services/gamefication.service';

@Controller()
export class AppController {
  constructor(private readonly gameficationService: GameficationService) {}

  @MessagePattern({ cmd: 'create_challenge' })
  createChallenge(payload: ChallengeDto) {
    return this.gameficationService.createChellenge(payload);
  }
}
