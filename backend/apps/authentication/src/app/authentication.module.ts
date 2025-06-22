import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoginService } from './services/login.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [LoginService],
})
export class AuthenticationModule {}
