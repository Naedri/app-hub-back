import {
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Role, Token } from '@prisma/client';
import { TokenContentEntity, TokenWrapEntity } from './entities/token.entity';
import {
  UserNotAuthEntity,
  UserOneAuthEntity,
} from 'src/users/entities/user-auth.entity';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';

// purposes : retrieving an user and verifying the password
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async login(email: string, pwd: string): Promise<TokenWrapEntity> {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPwdValid = await compare(pwd, user.password);
    if (!isPwdValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokenUuid = (await this.saveToken(user.id))?.id;

    //we choose a property name of sub to hold our userId value to be consistent with JWT standards
    const accessTokenContent: TokenContentEntity = {
      sub: user.id,
      role: user.role,
      tokenUuid,
    };
    const accessToken = this.jwtService.sign(accessTokenContent);

    this.logger.log(
      `User with id : ${user.id} and email: ${email} has just logged.`,
    );
    return { accessToken };
  }

  async register(email: string, pwd: string): Promise<UserNotAuthEntity> {
    const emailExists = await this.userService.getByEmail(email);
    if (emailExists) {
      throw new NotAcceptableException('Email already exists.');
    }
    if (!this.checkEmail(email)) {
      throw new NotAcceptableException('Email is incorrect.');
    }
    if (!this.checkPassword(pwd)) {
      throw new NotAcceptableException(
        'Password should contain at least one number and one special character, and between 8 and 16 characters.',
      );
    }

    const rounds = this.configService.get<string>('HASH_ROUND');
    const hashedPwd = await hash(pwd, parseInt(rounds));

    const user = await this.userService.create({
      email: email,
      password: hashedPwd,
      role: Role.CLIENT,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    this.logger.log(
      `User with id : ${user.id} and email: ${user.email} has just registered.`,
    );
    return result;
  }

  async validateUser(
    id: number,
    role: Role,
    tokenUuid: string,
  ): Promise<UserOneAuthEntity> {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new UnauthorizedException(`User with id : ${id} not found.`);
    }
    if (user.role !== role) {
      throw new UnauthorizedException(
        `User with id : ${user.id} used a token with an outdated role, it was : ${role} instead of ${user.role}.`,
      );
    }

    const token: Token = await this.prisma.token.findUnique({
      where: { id: tokenUuid },
    });
    if (token == null || token.userId !== id) {
      throw new UnauthorizedException(
        `User with id : ${user.id} used an outdated token .`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return { ...result, tokenUuid };
  }

  checkPassword(pwd: string): boolean {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    const isStrong = regex.test(pwd);
    this.logger.log(`Password is ${isStrong ? 'valid' : 'invalid'}.`);
    return isStrong;
  }

  checkEmail(email: string): boolean {
    const regex = /.+@.+\..+/;
    const isValid = regex.test(email);
    this.logger.log(`Email is ${isValid ? 'valid' : 'invalid'}.`);
    return isValid;
  }

  async logout(user: UserOneAuthEntity, tokenUuid?: string): Promise<boolean> {
    if (
      user.role !== Role.ADMIN ||
      (user.role === Role.ADMIN && tokenUuid == undefined)
    ) {
      return this.banToken(user.tokenUuid);
    }
    if (user.role === Role.ADMIN && tokenUuid !== undefined) {
      return this.banToken(tokenUuid);
    }
    return false;
  }

  /**
   * Saving the token in a whitelist allowing its checking in the future even if its expiration is not overdue
   * @param userId
   * @returns
   */
  async saveToken(userId: number): Promise<Token> {
    let token: Token;
    try {
      token = await this.prisma.token.create({ data: { userId: userId } });
    } catch (error) {
      this.logger.error(error);
    }
    return token;
  }

  /**
   * Remove the token from the whitelist even if its expiration is not overdue
   * @param tokenUuid
   * @returns
   */
  async banToken(tokenUuid: string): Promise<boolean> {
    let token: Token;
    try {
      token = await this.prisma.token.delete({
        where: {
          id: tokenUuid,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
    this.logger.log(
      `The following token has just expired: ${token.id}, it matched with the following user id : ${token.userId}.`,
    );
    return true;
  }
}
