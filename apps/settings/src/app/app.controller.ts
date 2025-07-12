import { Controller } from '@nestjs/common';
import { SettingsService } from './services/settingsService';

@Controller()
export class AppController {
  constructor(private readonly SettingsService: SettingsService) { }


}
