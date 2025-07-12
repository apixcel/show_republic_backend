import {
    Controller,
    Inject,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';


@UseGuards(AuthGuard('jwt'))
@Controller('notification')
export class NotificationController {
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }


}
