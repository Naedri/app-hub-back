import { Subscription } from '@prisma/client';

// replacing id by subId and removing userId
type IAccess = { subId: number } & Omit<Subscription, 'id' | 'userId'>;

export class AccessEntity implements IAccess {
  subId: number;
  appId: number;
  url: string;
  accessUrlToken?: string;
}
