import { Injectable } from '@nestjs/common';

@Injectable()
export class GamificationService {
  getHello(): string {
    return 'Hello World!';
  }
}
