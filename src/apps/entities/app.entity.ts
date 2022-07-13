import { Application, Prisma } from '@prisma/client';

type IApp = Application;

export class AppEntity implements IApp {
  isPublic: boolean;
  id: number;
  name: string;
  landingPage: string;
  description: Prisma.JsonValue;
  baseURL: string;
}

type IAppNoUrl = Omit<AppEntity, 'baseURL'>;

export class AppDiscoverEntity implements IAppNoUrl {
  isPublic: boolean;
  id: number;
  name: string;
  landingPage: string;
  description: Prisma.JsonValue;
}
