import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '@show-republic/config';
import { PostEntity, UserEntity } from '@show-republic/entities';
import { LikeController } from './app.controller';
import { LikeService } from './services/likeToggle.service';
import { LikeEntity } from 'libs/entities/src/lib/LikeToogle.entities';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    MikroOrmModule.forFeature([PostEntity, LikeEntity], 'mongo'),
    JwtModule,
  ],
  controllers: [
    LikeController
  ],
  providers: [
    LikeService
  ],
})
export class AppModule { }
