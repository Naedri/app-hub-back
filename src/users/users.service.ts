import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<User | undefined> {
    let user: User | undefined;
    try {
      user = await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      Logger.error(error);
    }
    return user;
  }

  async getUserById(userId: number): Promise<User | undefined> {
    let user: User | undefined;
    try {
      user = await this.prisma.user.findUnique({ where: { id: userId } });
    } catch (error) {
      Logger.error(error);
    }
    return user;
  }
}
