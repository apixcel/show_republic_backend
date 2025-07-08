import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ToggleLikeDto } from 'libs/dtos/src/lib/LikeToggle.dto';
import { lastValueFrom } from 'rxjs';

@UseGuards(AuthGuard('jwt'))
@Controller('post-like-dislike')
export class PostLikeToggleController {
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

    @Post('toggle')
    async toggleLike(@Body() likeToggleDto: ToggleLikeDto, @Request() req: any) {
        const userId = req.user.userId;
        const data = { ...likeToggleDto, userId };

        return await lastValueFrom(
            this.natsClient.send({ cmd: 'post_like_toggle' }, data),
        );
    }

    @Get('all-reactions')
    async getAllReactions() {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'get-all-reactions' }, {})
        );
    }
}
