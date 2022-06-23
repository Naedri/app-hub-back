import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
//SetMetadata allow to build a decorator that assigns metadata to the class/function using the specified key.
export const Roles = (...args: Role[]) => SetMetadata(ROLES_KEY, args);
