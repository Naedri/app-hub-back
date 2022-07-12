import { Application, Prisma } from '@prisma/client';

type IApp = Application;

export class AppEntity implements IApp {
  id: number;
  name: string;
  landingPage: string;
  description: Prisma.JsonValue;
  baseURL: string;
}

type IAppNoUrl = Omit<AppEntity, 'baseURL'>;

export class AppDiscoverEntity implements IAppNoUrl {
  id: number;
  name: string;
  landingPage: string;
  description: Prisma.JsonValue;
}
