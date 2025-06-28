import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, DatabaseModule } from '@show-republic/config';
import { UserEntity } from '@show-republic/entities';
import { JWTSTRATEGY } from '@show-republic/guards';
import { GoogleStrategy } from '@show-republic/oauthStrategy';
import { SetCookieUtilService } from '@show-republic/utils';
import { AuthenticationController } from './controllers/authentication.controller';
import { CategoryController } from './controllers/category.controller';
import { PostController } from './controllers/post.controller';
import { PostCommentController } from './controllers/postComment.controller';
import { NatsClientModule } from './nats-client.module';
import { PostLikeToggleController } from './controllers/postLikeToggle.controller';

@Module({
  imports: [
    ConfigModule,
    NatsClientModule,
    DatabaseModule,
    MikroOrmModule.forFeature([UserEntity], 'postgres'),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthenticationController, PostController, CategoryController, PostLikeToggleController, PostCommentController],
  providers: [JWTSTRATEGY, GoogleStrategy, SetCookieUtilService],
  // providers: [],
})
export class AppModule { }
