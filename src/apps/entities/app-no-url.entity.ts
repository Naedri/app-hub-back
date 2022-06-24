import { AppEntity } from './app.entity';

type IAppNoUrl = Omit<AppEntity, 'url'>; // User without password

export class AppNoUrlEntitiy implements IAppNoUrl {
  id: number;
  name: string;
}
