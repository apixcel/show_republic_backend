import { EntityManager } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateRoleDto, UpdateRolePermissionsDto } from '@show-republic/dtos';
import { PermissionEntity, RoleEntity } from '@show-republic/entities';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
  ) {}

  async createRole(dto: CreateRoleDto): Promise<RoleEntity> {
    const forkedEm = this.em.fork();
    const roleRepo = forkedEm.getRepository(RoleEntity);
    const permissionRepo = forkedEm.getRepository(PermissionEntity);

    const role = roleRepo.create({ name: dto.name });

    for (const perm of dto.permissions) {
      const permission = permissionRepo.create({
        category: perm.category,
        action: perm.action,
        role,
      });
      role.permissions.add(permission);
    }

    await forkedEm.persistAndFlush(role);
    return role;
  }

  async getAllRoles(): Promise<RoleEntity[]> {
    const forkedEm = this.em.fork();
    const roleRepo = forkedEm.getRepository(RoleEntity);
    return await roleRepo.findAll({ populate: ['permissions'] });
  }

  async getRoleById(id: string): Promise<RoleEntity> {
    const forkedEm = this.em.fork();
    const roleRepo = forkedEm.getRepository(RoleEntity);
    const role = await roleRepo.findOne({ _id: new ObjectId(id) }, { populate: ['permissions'] });
    if (!role) throw new RpcException('Role not found');
    return role;
  }
  async updateRolePermissions(dto: UpdateRolePermissionsDto, roleId: string): Promise<RoleEntity> {
    const forkedEm = this.em.fork();
    const roleRepo = forkedEm.getRepository(RoleEntity);
    const permissionRepo = forkedEm.getRepository(PermissionEntity);

    const role = await roleRepo.findOne({ _id: new ObjectId(roleId) }, { populate: ['permissions'] });
    if (!role) throw new RpcException('Role not found');

    // Remove all existing permissions
    for (const perm of role.permissions) {
      forkedEm.remove(perm);
    }

    // Create and attach the new ones
    const newPermissions = dto.permissions.map((p) =>
      permissionRepo.create({ category: p.category, action: p.action, role }),
    );

    role.permissions.set(newPermissions);
    await forkedEm.persistAndFlush(role);

    return role;
  }

  async deleteRole(id: string): Promise<void> {
    const forkedEm = this.em.fork();
    const roleRepo = forkedEm.getRepository(RoleEntity);
    const permissionRepo = forkedEm.getRepository(PermissionEntity);

    const role = await roleRepo.findOne({ _id: new ObjectId(id) });
    if (!role) throw new RpcException('Role not found');

    // Delete all permissions with role ID
    await permissionRepo.nativeDelete({ role: new ObjectId(id) });

    // Remove the role
    forkedEm.remove(role);
    await forkedEm.flush();
  }
}
