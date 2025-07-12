import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, DatabaseModule, S3ClientProvider } from '@show-republic/config';
import { UserEntity } from '@show-republic/entities';
import { JWTSTRATEGY } from '@show-republic/guards';
import { GoogleStrategy } from '@show-republic/oauthStrategy';
import { SetCookieUtilService } from '@show-republic/utils';
import { AdminController } from './controllers/admin.controller';
import { AuthenticationController } from './controllers/authentication.controller';
import { CategoryController } from './controllers/category.controller';
import { CreatorController } from './controllers/creator.controller';
import { GameficationController } from './controllers/gamefication.controller';
import { PostController } from './controllers/post.controller';
import { PostCommentController } from './controllers/postComment.controller';
import { PostLikeToggleController } from './controllers/postLikeToggle.controller';
import { ProductController } from './controllers/product.controller';
import { RolePermissionController } from './controllers/rolePermission.controller';
import { StatisticsController } from './controllers/statistics.controller';
import { UploadController } from './controllers/upload.controller';
import { NatsClientModule } from './nats-client.module';
import { UploadfileService } from './service/upload.service';

@Module({
  imports: [
    ConfigModule,
    NatsClientModule,
    DatabaseModule,
    MikroOrmModule.forFeature([UserEntity], 'postgres'),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    AuthenticationController,
    PostController,
    CategoryController,
    ProductController,
    PostLikeToggleController,
    PostCommentController,
    GameficationController,
    CreatorController,
    AdminController,
    StatisticsController,
    RolePermissionController,
    UploadController,
  ],
  providers: [JWTSTRATEGY, GoogleStrategy, SetCookieUtilService, UploadfileService, S3ClientProvider],
  // providers: [],
})
export class AppModule { }
