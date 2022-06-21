import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Role, User } from '@prisma/client';
import { Auth } from './entities/auth.entity';
import { Config } from 'config';
import { UserNotAuth } from 'src/users/entities/user-auth.entity';

// purposes : retrieving an user and verifying the password
@Injectable()
export class AuthService {
  constructor(
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
    const hashedPwd = await this.hash(pwd);

    const user = await this.userService.create({
      email: email,
      password: hashedPwd,
      role: Role.CLIENT,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return result;
  }

  async validateUser(userId: string): Promise<User> {
    return this.userService.getById(parseInt(userId, Config.saltRounds));
  }

  checkPassword(pwd: string): boolean {
    return pwd.length > 6 && pwd.length < 16;
  }

  async hash(str: string, rounds = Config.saltRounds): Promise<string> {
    return hash(str, rounds);
  }
}
