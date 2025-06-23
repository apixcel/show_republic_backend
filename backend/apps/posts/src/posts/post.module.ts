import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostController } from './post.controller';
import { ViewPostService } from './services/ViewPost.service';
import { CreatePostService} from './services/Createpost.service';
import { PostEntity } from '@show-republic/entities';
import { DatabaseModule, MongodbConfig } from '@show-republic/config';

@Module({
  imports: [
 DatabaseModule,
    MikroOrmModule.forFeature([PostEntity], 'mongo'), // Use 'mongo' context here
  ],
  controllers: [PostController],
  providers: [CreatePostService,ViewPostService],
})
export class PostModule {}
