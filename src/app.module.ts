import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppsModule } from './apps/apps.module';
import { SubsModule } from './subs/subs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AppsModule,
    SubsModule,
  ],
  controllers: [AppController],
  providers: [Logger, AppService],
})
export class AppModule {}
