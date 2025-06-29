import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@UseGuards(AuthGuard('jwt')) // Use the built-in JwtAuthGuard directly
@Controller('admin')
export class AdminsController {
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

    // ****** View Profile *******
    @Get('view_admins')
    async getAdmins(@Request() req: any) {
        return await lastValueFrom(this.natsClient.send({ cmd: 'viewAdmins' }, ''));
    }

    @Post('login')
    async login(@Body() payload: any) {
        const res = await lastValueFrom(this.natsClient.send({ cmd: 'admin.login' }, payload));
        return res;
    }

    @Post('signup')
    async signup(@Body() payload: any) {
        const res = await firstValueFrom(this.natsClient.send({ cmd: 'admin.signup' }, payload));
        return res;
    }
}
