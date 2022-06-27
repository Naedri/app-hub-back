import { Subscription } from '@prisma/client';

type ISubNoUser = { id: number } & Omit<Subscription, 'userId'>;

export class SubNoUserEntity implements ISubNoUser {
  id: number;
  appId: number;
}
