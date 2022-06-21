import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserAuth } from './entities/user-auth.entity';

// purposes : retrieving an user and verifying the password
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pwd: string): Promise<UserAuth> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPwdValid = await compare(pwd, user.password);
    if (!isPwdValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { password, ...result } = user;
    const accessToken = this.jwtService.sign({
      userId: user.id,
    });
    return { accessToken, ...result };
  }
}
