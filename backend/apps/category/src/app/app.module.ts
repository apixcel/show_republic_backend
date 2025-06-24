import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { CategoryEntity, UserEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { CategoryService } from './services/category.service';

@Module({
  imports: [
    DatabaseModule,
    MikroOrmModule.forFeature([CategoryEntity, UserEntity], 'postgres'),
  ],
  controllers: [AppController],
  providers: [CategoryService],
})
export class AppModule {}
