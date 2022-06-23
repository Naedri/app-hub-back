import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * compare the roles assigned to the current user to the actual roles required by the current route being processed
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //The Reflector#get method allows us to easily access the metadata by passing in two arguments:
    //a metadata key and a context (i.e. decorator target) to retrieve the metadata from.

    const key = 'roles'; //referring to roles.decorator.ts
    const metadataRef = context.getHandler(); //giving reference to extract the metadata for the currently processed route handler.
    const requiredRoles = this.reflector.get<string[]>(key, metadataRef);
    Logger.log('metadata ref=' + metadataRef);
    Logger.log(requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const hasRole = () =>
      !!user.roles.find(
        (role) => !!requiredRoles.find((item) => item === role),
      );

    return user && user.roles && hasRole();
    // return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
