import { Logger, Module } from '@nestjs/common';
import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';
import { RolesGuard } from 'src/roles/guards/roles.guard';

@Module({
  controllers: [AppsController],
  providers: [Logger, AppsService, RolesGuard],
})
export class AppsModule {}
