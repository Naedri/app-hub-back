import { Logger, Module } from '@nestjs/common';
import { SubsService } from './subs.service';
import { SubsController } from './subs.controller';
import { RolesGuard } from 'src/roles/guards/roles.guard';

@Module({
  controllers: [SubsController],
  providers: [SubsService, Logger, RolesGuard],
})
export class SubsModule {}
