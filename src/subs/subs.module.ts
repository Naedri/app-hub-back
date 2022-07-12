import { Logger, Module } from '@nestjs/common';
import { SubsService } from './subs.service';
import { SubsController } from './subs.controller';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';

const jwtFactory = {
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET_APPS'),
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRES_IN_APPS'),
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [JwtModule.registerAsync(jwtFactory)],
  controllers: [SubsController],
  providers: [Logger, SubsService, Logger, RolesGuard, PrismaService],
})
export class SubsModule {}
