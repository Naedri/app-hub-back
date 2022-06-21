import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Config } from 'config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from 'src/users/users.service';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: Config.secret,
      signOptions: { expiresIn: Config.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy],
})
export class AuthModule {}
