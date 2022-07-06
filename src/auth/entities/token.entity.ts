import { Role } from '@prisma/client';

/**
 * Token wrapper
 */
export class TokenWrapEntity {
  accessToken: string;
}

/**
 * Token content
 */
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
