import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserOneAuthEntity } from 'src/users/entities/user-auth.entity';
import { AuthService } from './auth.service';
import { TokenContentEntity } from './entities/token.entity';

function strategyFactory(configService: ConfigService) {
  return {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: configService.get<string>('JWT_SECRET'),
  };
}

/**
 * JwtStrategy is used as a Guard.
 * All it does is verify the JWT based on configuration
 * (strategyFactory() and validate()).
 * It will be used with the @UseGuards(MyJwtAuthGuard) (i.e. AuthGuard('my-jwt'))
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'my-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super(strategyFactory(configService));
  }

  /**
   * Verifying whether an user exists.
   * It will be used during the Passport library authentication flow to populate full user.
   * @param payload
   * @returns a full user if the validation succeeds, or a null if it fails
   */
  async validate(payload: TokenContentEntity): Promise<UserOneAuthEntity> {
    const user = await this.authService.validateUser(
      payload.sub,
      payload.role,
      payload.tokenUuid,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return { ...user, tokenUuid: payload.tokenUuid };
  }
}
