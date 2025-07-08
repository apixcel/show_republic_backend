import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { ProductEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { ProductService } from './services/product.service';

@Module({
  imports: [DatabaseModule, MikroOrmModule.forFeature([ProductEntity], 'mongo')],
  controllers: [AppController],
  providers: [ProductService],
})
export class AppModule {}
