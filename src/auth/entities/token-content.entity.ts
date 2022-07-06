import { Role } from '@prisma/client';

export class TokenContentEntity {
  tokenUuid: string;
  sub: number;
  role: Role;
}

export class AppTokenContentEntity {
  sub: number;
  appId: number;
  role: Role;
}
