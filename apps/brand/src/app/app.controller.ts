import { Controller } from '@nestjs/common';
import { BrandService } from './services/brandService';

@Controller()
export class AppController {
  constructor(private readonly brandService: BrandService) { }


}
