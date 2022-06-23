import { Application } from '@prisma/client';

export class App implements Application {
  id: number;
  name: string;
  url: string;
}
