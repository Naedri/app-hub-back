import { Role } from '@prisma/client';

/**
 * Token wrapper
 */
/**
 * accessToken: token signed which contains data fromm TokenContentEntity
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
/**
 * sub : hold our userId value to be consistent with JWT standards
 * role : role of the user
 * appId : id of the app the token is giving access
 * subId : id of the subscription which allow the user to have access to the app
 * subTokenUuid : uuid of the subscription token which is created to request the app
 */
export class AppTokenContentEntity {
  sub: number;
  role: Role;
  appId: number;
  subId: number;
  subTokenUuid: string;
}
