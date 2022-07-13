import { Application, Subscription, SubToken } from '@prisma/client';

/**
 * Access entity
 */
// replacing id by subId and removing userId
type IAccess = { subId: number } & Omit<Subscription, 'id' | 'userId'>;
export class AccessEntity implements IAccess {
  subId: number;
  appId: number;
  url: string;
  accessUrlToken?: string;
}

/**
 * Access entity details
 */
// as the token is generated with the subTokenUuid, it is added in the subTokens property
interface ISubTokenWithData extends SubToken {
  accessUrlTokenized?: string;
}
type IAccessDetails = Subscription & {
  application: Application;
  subTokens: ISubTokenWithData[];
};
export class AccessEntityDetails implements IAccessDetails {
  id: number;
  appId: number;
  userId: number;
  application: Application;
  subTokens: ISubTokenWithData[];
}
/**
 * Subscription entity
 */
type ISubNoUser = { id: number } & Omit<Subscription, 'userId'>;
export class SubNoUserEntity implements ISubNoUser {
  id: number;
  appId: number;
}
