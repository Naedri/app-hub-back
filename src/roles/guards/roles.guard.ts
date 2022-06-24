import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { UserNotAuthEntity } from 'src/users/entities/user-auth.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * compare the roles assigned to the current user
 * with the actual roles required by the current route being processed
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //The Reflector#get method allows us to easily access the metadata by passing in two arguments:
    //a metadata key and a context (i.e. decorator target) to retrieve the metadata from.

    const key = ROLES_KEY; //referring to roles.decorator.ts
    const metadataRef = context.getHandler(); //referring to the currently processed route handler.
    const requiredRoles = this.reflector.get<Role[]>(key, metadataRef);
    // console.log('LOG requiredRoles: ' + requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    const user: UserNotAuthEntity = context.switchToHttp().getRequest()?.user;
    // console.log('LOG user: ' + JSON.stringify(user));
    return requiredRoles.some((role) => user?.role?.includes(role));
  }
}
