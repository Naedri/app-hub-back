import { Injectable, Logger } from '@nestjs/common';
import { User, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: {
    email: string;
    password: string;
    role: Role;
  }): Promise<User> {
    let result;
    try {
      result = await this.prisma.user.create({ data: user });
    } catch (error) {
      Logger.error(error);
    }
    return result;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    let user: User | undefined;
    try {
      user = await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      Logger.error(error);
    }
    return user;
  }

  async getById(userId: number): Promise<User | undefined> {
    let user: User | undefined;
    try {
      user = await this.prisma.user.findUnique({ where: { id: userId } });
    } catch (error) {
      Logger.error(error);
    }
    return user;
  }
}
