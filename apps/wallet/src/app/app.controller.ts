import { Controller } from '@nestjs/common';
import { WalletService } from './services/walletService';

@Controller()
export class AppController {
  constructor(private readonly walletService: WalletService) { }


}
