import { Injectable, Logger } from '@nestjs/common';
import { CreateSubDto } from './dto/create-sub.dto';
import { UpdateSubDto } from './dto/update-sub.dto';
import { Subscription } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class SubsService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {
    this.logger = new Logger(this.constructor.name);
  }

  async getUserSubs(
    userId: number,
    subId: number = undefined,
  ): Promise<Subscription[]> {
    let result;
    try {
      result = await this.prisma.subscription.findMany({
        where: {
          userId: {
            equals: userId,
          },
        },
      });
      if (!!subId) {
        result = [result[subId]];
      }
      return result;
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  async create(createSubDto: CreateSubDto) {
    let result;
    try {
      result = await this.prisma.subscription.create({ data: createSubDto });
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  async findAll() {
    let result;
    try {
      result = await this.prisma.subscription.findMany({});
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  async findOne(id: number) {
    let result;
    try {
      result = await this.prisma.subscription.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  async update(id: number, updateSubDto: UpdateSubDto) {
    let result;
    try {
      result = await this.prisma.subscription.update({
        where: { id },
        data: { ...updateSubDto },
      });
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  async remove(id: number) {
    let result;
    try {
      result = await this.prisma.subscription.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }
}
