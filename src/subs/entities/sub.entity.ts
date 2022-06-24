import { Subscription } from '@prisma/client';

type ISubNoUser = Omit<Subscription, 'userId'>;
type ISubNoApp = Omit<Subscription, 'appId'>;
type ISub = { id: number };

export class SubNoUserEntity implements ISubNoUser {
  id: number;
  appId: number;
}

export class SubNoAppEntity implements ISubNoApp {
  id: number;
  userId: number;
}

export class SubEntity implements ISub {
  id: number;
  appId?: number;
  userId?: number;
}
