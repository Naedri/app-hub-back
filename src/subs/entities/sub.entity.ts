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

type IAccessDetails = Subscription & {
  applications: Application[];
  subTokens: SubToken[];
};

export class AccessEntityDetails implements IAccessDetails {
  id: number;
  appId: number;
  userId: number;
  applications: Application[];
  subTokens: SubToken[];
}
/**
 * Subscription entity
 */
type ISubNoUser = { id: number } & Omit<Subscription, 'userId'>;
export class SubNoUserEntity implements ISubNoUser {
  id: number;
  appId: number;
}
