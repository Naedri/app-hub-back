import { Logger, Module } from '@nestjs/common';
import { SubsService } from './subs.service';
import { SubsController } from './subs.controller';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SubsController],
  providers: [SubsService, Logger, RolesGuard, PrismaService, JwtService],
})
export class SubsModule {}
