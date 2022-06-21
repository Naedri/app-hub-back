import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Config } from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Config.secret,
    });
  }
  async validate(payload: { userId: string }): Promise<User> {
    const user: User = await this.authService.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
