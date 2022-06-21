import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { Auth } from './entities/auth.entity';

// purposes : retrieving an user and verifying the password
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pwd: string): Promise<Auth> {
    const user = await this.userService.getUserByEmail(email);

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

  async validateUser(userId: string): Promise<User> {
    return await this.userService.getUserById(parseInt(userId, 10));
  }
}
