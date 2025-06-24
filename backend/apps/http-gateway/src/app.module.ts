import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, DatabaseModule } from '@show-republic/config';
import { UserEntity } from '@show-republic/entities';
import { JWTSTRATEGY } from '@show-republic/guards';
import { AuthenticationController } from './controllers/authentication.controller';
import { CategoryController } from './controllers/category.controller';
import { PostController } from './controllers/post.controller';
import { NatsClientModule } from './nats-client.module';

@Module({
  imports: [
    ConfigModule,
    NatsClientModule,
    DatabaseModule,
    MikroOrmModule.forFeature([UserEntity], 'postgres'),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthenticationController, PostController, CategoryController],
  providers: [JWTSTRATEGY],
  // providers: [],
})
export class AppModule {}
