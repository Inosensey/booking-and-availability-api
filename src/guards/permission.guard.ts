// guards/permissions.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

interface AuthenticatedUser {
  userId: string;
  roleType: string;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
type RoleType = string;
type PermissionName = string;
type ResourcePermissions = Record<RoleType, PermissionName[]>;
type PermissionStructure = Record<string, ResourcePermissions>;

type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';
type HttpMethodMap = Record<HttpMethod, PermissionName>;

export const ResourcePermissions = (permissions: Record<string, string[]>) =>
  Reflector.createDecorator<Record<string, string[]>>()(permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private permissionStructures: PermissionStructure = {
    // User module permissions
    users: {
      admin: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE_ROLES'],
      customer: ['READ', 'UPDATE', 'DELETE'],
      talent: ['READ', 'UPDATE', 'DELETE'],
    },
    // Talents module permissions
    talents: {
      admin: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE_ROLES'],
      customer: ['READ'],
      talent: ['CREATE', 'READ', 'UPDATE'],
    },
    // Bookings module permissions
    bookings: {
      admin: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE_ROLES'],
      customer: ['CREATE', 'READ'],
      talent: ['READ', 'UPDATE'],
    },
    // Default/fallback permissions
    default: {
      admin: ['ALL'],
      user: ['READ'],
    },
  };

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    const method = request.method as HttpMethod;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const resource = this.getResourceFromUrl(request.url);

    const action = this.mapMethodToAction(method);

    const resourcePermissions =
      this.permissionStructures[resource] || this.permissionStructures.default;

    const userPermissions = resourcePermissions[user.roleType] || [];

    const hasPermission =
      userPermissions.includes('ALL') || userPermissions.includes(action);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Role ${user.roleType} cannot ${action.toLowerCase()} ${resource}`,
      );
    }

    return true;
  }

  private getResourceFromUrl(url: string): string {
    const path = url.split('?')[0];
    const parts = path.split('/').filter(Boolean);

    // Handle /api prefix
    if (parts[0] === 'api') {
      return parts[1] || 'default';
    }

    return parts[0] || 'default';
  }

  private mapMethodToAction(method: HttpMethod): PermissionName {
    const map: HttpMethodMap = {
      GET: 'READ',
      HEAD: 'READ',
      OPTIONS: 'READ',
      POST: 'CREATE',
      PUT: 'UPDATE',
      PATCH: 'UPDATE',
      DELETE: 'DELETE',
    };
    return map[method] || 'READ';
  }
}
