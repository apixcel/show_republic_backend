import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@show-republic/config';
import { AuthenticationController } from './controllers/authentication.controller';
import { NatsClientModule } from './nats-client.module';

@Module({
  imports: [
    ConfigModule,
    NatsClientModule,
    // DatabaseModule,
    // MikroOrmModule.forFeature([UserEntity], 'postgres'),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthenticationController],
  // providers: [JWTSTRATEGY],
  providers: [],
})
export class AppModule {}
