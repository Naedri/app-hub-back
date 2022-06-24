import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateSubDto } from './dto/create-sub.dto';
import { UpdateSubDto } from './dto/update-sub.dto';
import { SubEntity } from './entities/sub.entity';

@Injectable()
export class SubsService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {
    this.logger = new Logger(this.constructor.name);
  }

  async getUserSubs(
    userId: number,
    subId: number = undefined,
  ): Promise<SubEntity[]> {
    let result: SubEntity[];
    try {
      result = await this.prisma.subscription.findMany({
        where: {
          userId: {
            equals: userId,
          },
        },
      });
      if (subId) {
        result = [result[subId]];
      }
    } catch (error) {
      this.logger.error(error);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return result.map(({ userId, ...item }) => item);
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
