import { Application } from '@prisma/client';

export class AppEntity implements Application {
  id: number;
  name: string;
  url: string;
}
