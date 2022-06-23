import { Role } from '@prisma/client';

export class TokenContentEntity {
  sub: number;
  role: Role;
}
