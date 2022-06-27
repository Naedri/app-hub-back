import { Injectable, Logger } from '@nestjs/common';
import { Subscription } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateSubDto } from './dto/create-sub.dto';
import { UpdateSubDto } from './dto/update-sub.dto';
import { SubEntity } from './entities/sub.entity';
import { AccessEntity } from './entities/access.entity';

@Injectable()
export class SubsService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   *
   * @param userId
   * @param appId
   * @returns list of the url for each app the user has an appropriate subscription
   */
  async getUserAccess(
    userId: number,
    appId: number = undefined,
  ): Promise<AccessEntity[]> {
    let results: AccessEntity[];
    try {
      const subscriptions: Subscription[] =
        await this.prisma.subscription.findMany({
          where: {
            userId: {
              equals: userId,
            },
          },
        });

      if (appId) {
        results = [results[appId]];
      }
      // renaming id by subId
      let temp = subscriptions?.map(({ id, ...item }) => ({
        subId: id,
        ...item,
      }));
      // adding url
      temp = temp.map((item) => ({
        url: this.getProtectedUrl(item.userId, item.appId),
        ...item,
      }));
      //removing userId
      results = temp?.map(({ userId, ...item }) => item) as AccessEntity[];
    } catch (error) {
      this.logger.error(error);
    }
    return results;
  }

  getProtectedUrl(userId: number, appId: number): string {
    return 'www.google.com';
  }
  /**
   *
   * @param userId
   * @param subId
   * @returns list of subscriptions of an user including the id of the associated app
   */
  async getUserSubs(
    userId: number,
    subId: number = undefined,
  ): Promise<SubEntity[]> {
    let results: SubEntity[];
    try {
      results = await this.prisma.subscription.findMany({
        where: {
          userId: {
            equals: userId,
          },
        },
      });
      if (subId) {
        results = [results[subId]];
      }
    } catch (error) {
      this.logger.error(error);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return results?.map(({ userId, ...item }) => item);
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
