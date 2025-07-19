import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChallengeDto } from '@show-republic/dtos';
import { GameficationService } from './services/gamefication.service';
import { GameWallerService } from './services/gameWallet.service';

@Controller()
export class AppController {
  constructor(
    private readonly gameficationService: GameficationService,
    private gameWalletService: GameWallerService,
  ) {}

  @MessagePattern({ cmd: 'create_challenge' })
  createChallenge(payload: ChallengeDto) {
    return this.gameficationService.createChellenge(payload);
  }
  @MessagePattern({ cmd: 'get_upcomming_challenge' })
  getUpcommingChellenge(query: Record<string, any>) {
    return this.gameficationService.getUpcommingChellenge(query);
  }
  @MessagePattern({ cmd: 'get_active_challenge' })
  getActiveChallenge(query: Record<string, any>) {
    return this.gameficationService.getActiveChallenge(query);
  }
  @MessagePattern({ cmd: 'get_completed_challenge' })
  getCompletedChallenges(query: Record<string, any>) {
    return this.gameficationService.getCompletedChallenges(query);
  }

  // ----- game wallet api start here ----
  @MessagePattern({ cmd: 'game_wallet' })
  getMyWallet(userId: string) {
    return this.gameWalletService.getMyWallet(userId);
  }
}
