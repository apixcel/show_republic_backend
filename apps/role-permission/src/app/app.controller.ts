import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateRoleDto, UpdateRolePermissionsDto } from '@show-republic/dtos';
import { RolePermissionService } from './services/rolePermission.service';

@Controller()
export class AppController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @MessagePattern({ cmd: 'create_role' })
  async createRole(createRoleDto: CreateRoleDto) {
    return await this.rolePermissionService.createRole(createRoleDto);
  }

  @MessagePattern({ cmd: 'get_all_roles' })
  async getAllRoles() {
    return await this.rolePermissionService.getAllRoles();
  }

  @MessagePattern({ cmd: 'get_role_by_id' })
  async getRoleById(id: string) {
    return await this.rolePermissionService.getRoleById(id);
  }

  @MessagePattern({ cmd: 'update_role_permissions' })
  async updatePermissions({ dto, roleId }: { dto: UpdateRolePermissionsDto; roleId: string }) {
    return await this.rolePermissionService.updateRolePermissions(dto, roleId);
  }

  @MessagePattern({ cmd: 'delete_role' })
  async deleteRole(id: string) {
    return await this.rolePermissionService.deleteRole(id);
  }
}
