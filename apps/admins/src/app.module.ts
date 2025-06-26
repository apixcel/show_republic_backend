import { Module } from '@nestjs/common';
import { UserModule } from './User/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Module({
  imports: [
    UserModule,
  ]
})
export class AppModule {}
