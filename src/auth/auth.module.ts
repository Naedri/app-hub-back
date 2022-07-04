import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Logger, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';

const jwtFactory = {
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [PassportModule, JwtModule.registerAsync(jwtFactory)],
  controllers: [AuthController],
  providers: [Logger, AuthService, UsersService, JwtStrategy, PrismaService],
})
export class AuthModule {}
