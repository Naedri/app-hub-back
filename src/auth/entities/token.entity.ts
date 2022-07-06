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
//we choose a property name of sub to hold our userId value to be consistent with JWT standards
export class TokenContentEntity {
  sub: number;
  role: Role;
  tokenUuid: string;
}

//we choose a property name of sub to hold our userId value to be consistent with JWT standards
export class AppTokenContentEntity {
  appId: number;
  sub: number;
  role: Role;
  subTokenUuid: string;
}
