import { App } from './app.entity';

type IAppNoUrl = Omit<App, 'url'>; // User without password

export class AppNoUrl implements IAppNoUrl {
  id: number;
  name: string;
}
