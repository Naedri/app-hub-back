import { Logger, Module } from '@nestjs/common';
import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [AppsController],
  providers: [
    Logger,
    AppsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppsModule {}
