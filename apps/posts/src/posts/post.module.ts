import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostController } from './post.controller';
import { ViewPostService } from './services/ViewPost.service';
import { PostEntity } from '@show-republic/entities';
import { DatabaseModule, MongodbConfig } from '@show-republic/config';
import { CreatePostService } from './services/createpost.service';
import { ViewAllPostService } from './services/ViewAllPost.service';

@Module({
  imports: [
    DatabaseModule,
    MikroOrmModule.forFeature([PostEntity], 'mongo'), // Use 'mongo' context here
  ],
  controllers: [PostController],
  providers: [CreatePostService, ViewPostService, ViewAllPostService],
})
export class PostModule { }
