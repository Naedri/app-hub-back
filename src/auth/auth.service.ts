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
import { Role, User } from '@prisma/client';
import { Auth } from './entities/auth.entity';
import { UserNotAuth } from 'src/users/entities/user-auth.entity';
import { ConfigService } from '@nestjs/config';

// purposes : retrieving an user and verifying the password
@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pwd: string): Promise<Auth> {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPwdValid = await compare(pwd, user.password);
    if (!isPwdValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const accessToken = this.jwtService.sign({
      userId: user.id,
    });

    Logger.log(
      `User with id : ${user.id} and email: ${email} has just logged.`,
    );
    return { accessToken };
  }

  async register(email: string, pwd: string): Promise<UserNotAuth> {
    const emailExists = await this.userService.getByEmail(email);
    if (emailExists) {
      throw new NotAcceptableException('Email already exists');
    }
    if (!this.checkPassword(pwd)) {
      throw new NotAcceptableException('Password length incorrect');
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

    Logger.log(
      `User with id : ${user.id} and email: ${user.email} has just registered.`,
    );
    return result;
  }

  async validateUser(userId: string): Promise<User> {
    return this.userService.getById(parseInt(userId, 10));
  }

  checkPassword(pwd: string): boolean {
    return pwd.length > 6 && pwd.length < 16;
  }
}
