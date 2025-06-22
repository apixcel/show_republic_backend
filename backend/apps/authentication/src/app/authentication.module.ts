import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { LoginService } from './services/login.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:root@mongo:27017/show-republic?authSource=admin',
    ),
  ],
  controllers: [AppController],
  providers: [LoginService],
})
export class AuthenticationModule {}
