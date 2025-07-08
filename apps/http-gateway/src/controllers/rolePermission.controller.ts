import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { CreateRoleDto, UpdateRolePermissionsDto } from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';

@UseGuards(AuthGuard('jwt'))
@Controller('role-permission')
export class RolePermissionController {
  constructor(@Inject('NATS_SERVICE') private readonly natsClient: ClientProxy) {}

  @Post('create')
  async createRole(@Body() dto: CreateRoleDto, @Request() req: any) {
    // Optionally use user info for auditing
    const userId = req.user.userId;
    return await lastValueFrom(this.natsClient.send({ cmd: 'create_role' }, dto));
  }

  @Get('get')
  async getAllRoles() {
    return await lastValueFrom(this.natsClient.send({ cmd: 'get_all_roles' }, {}));
  }

  @Get('get/:id')
  async getRoleById(@Param('id') id: string) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'get_role_by_id' }, id));
  }

  @Patch('permissions/:roleId')
  async updatePermissions(@Body() dto: UpdateRolePermissionsDto, @Param('roleId') roleId: string) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'update_role_permissions' }, { dto, roleId }));
  }

  @Delete('delete/:id')
  async deleteRole(@Param('id') id: string) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'delete_role' }, id));
  }
}
