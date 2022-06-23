import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * compare the roles assigned to the current user
 * with the actual roles required by the current route being processed
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  canActivate(context: ExecutionContext): boolean {
    //The Reflector#get method allows us to easily access the metadata by passing in two arguments:
    //a metadata key and a context (i.e. decorator target) to retrieve the metadata from.

    const key = 'roles'; //referring to roles.decorator.ts
    const metadataRef = context.getHandler(); //referring to the currently processed route handler.
    const requiredRoles = this.reflector.get<string[]>(key, metadataRef);

    //TODO remove logs
    this.logger.log('metadata ref= ' + metadataRef);
    this.logger.log('required roles= ' + requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    this.logger.log('user= ' + user);
    const hasRole = () =>
      !!user.roles.find(
        (role) => !!requiredRoles.find((item) => item === role),
      );

    //TODO determine which way is better and remove unnecessary lines
    return user && user.roles && hasRole();
    // return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
