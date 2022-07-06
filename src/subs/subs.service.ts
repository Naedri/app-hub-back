import { Injectable, Logger } from '@nestjs/common';
import { Application, Role, Subscription } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateSubDto } from './dto/create-sub.dto';
import { UpdateSubDto } from './dto/update-sub.dto';
import { SubNoUserEntity } from './entities/sub.entity';
import { AccessEntity } from './entities/access.entity';
import { AppTokenContentEntity } from 'src/auth/entities/token-content.entity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class SubsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   *
   * @param userId
   * @param subId
   * @returns list of the url for each app the user has an appropriate subscription
   */
  async getUserAccess(
    userId: number,
    subId: number = undefined,
  ): Promise<AccessEntity[]> {
    let results: AccessEntity[];
    try {
      // eslint-disable-next-line prefer-const
      let criteria: any = {
        where: {
          userId: {
            equals: userId,
          },
        },
      };
      if (subId !== undefined) {
        criteria.where.id = { equals: subId as number };
      }
      const subscriptions = await this.prisma.subscription.findMany(criteria);

      // renaming id by subId
      let temp = subscriptions?.map(({ id, ...item }) => ({
        subId: id,
        ...item,
      }));
      // adding url
      temp = await Promise.all(
        temp?.map(async (item) => ({
          url: await this.getProtectedUrl(item.appId, item.userId),
          ...item,
        })),
      );
      // removing userId
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      results = temp?.map(({ userId, ...item }) => item) as AccessEntity[];
    } catch (error) {
      this.logger.error(error);
    }
    return results;
  }

  /**
   *
   * @param appId
   * @param userId
   * @returns url of the given appId with an authorization token
   */
  async getProtectedUrl(
    appId: number,
    userId: number,
    role = Role.CLIENT,
  ): Promise<string> {
    let url: string;
    const app: Application = await this.prisma.application.findUnique({
      where: { id: appId },
    });
    if (app) {
      //we choose a property name of sub to hold our userId value to be consistent with JWT standards
      const appTokenContent: AppTokenContentEntity = {
        sub: userId,
        role: role,
        appId: app.id,
      };
      const options: JwtSignOptions = {
        secret: app.secretJWT,
      };
      const appToken = await this.jwtService.signAsync(
        appTokenContent,
        options,
      );
      url = `${app.baseURL}?appToken=${appToken}`;
    }
    return url;
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
  ): Promise<SubNoUserEntity[]> {
    let results: Subscription[];
    try {
      // eslint-disable-next-line prefer-const
      let criteria: any = {
        where: {
          userId: {
            equals: userId,
          },
        },
      };
      if (subId !== undefined) {
        criteria.where.id = {
          equals: subId as number,
        };
      }
      results = await this.prisma.subscription.findMany(criteria);
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
