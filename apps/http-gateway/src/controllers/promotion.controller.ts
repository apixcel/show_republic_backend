import {
    Controller,
    Inject,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';


@UseGuards(AuthGuard('jwt'))
@Controller('promotion')
export class PromotionController {
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }


}
