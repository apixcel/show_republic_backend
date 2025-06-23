import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, DatabaseModule } from '@show-republic/config';
import { AuthenticationController } from './controllers/authentication.controller';
import { NatsClientModule } from './nats-client.module';
import { PostController } from './controllers/post.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '@show-republic/entities';
import { JWTSTRATEGY } from '@show-republic/guards';

@Module({
  imports: [
    ConfigModule,
    NatsClientModule,
    DatabaseModule,
    MikroOrmModule.forFeature([UserEntity], 'postgres'),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthenticationController, PostController],
  providers: [JWTSTRATEGY],
  // providers: [],
})
export class AppModule { }
