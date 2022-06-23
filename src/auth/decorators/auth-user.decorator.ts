import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserNotAuthEntity } from 'src/users/entities/user-auth.entity';

/**
 * Custom decorator to extract properties from the request object.
 */
export const AuthUser = createParamDecorator(
  /**
   *
   * @param propertyKey to be use in the controller as follow : @AuthUser('firstName')
   * @param ctx describing details about the current request pipeline
   * @returns particular property of the user object, attached to the request object or the user object only
   */
  (propertyKey: string, ctx: ExecutionContext): UserNotAuthEntity => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return propertyKey ? user?.[propertyKey] : user;
  },
);
