import { Injectable, Logger } from '@nestjs/common';
import {
  Application,
  Prisma,
  Role,
  Subscription,
  SubToken,
} from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateSubDto } from './dto/create-sub.dto';
import { UpdateSubDto } from './dto/update-sub.dto';
import {
  AccessEntity,
  AccessEntityDetails,
  SubNoUserEntity,
} from './entities/sub.entity';
import { AppTokenContentEntity } from 'src/auth/entities/token.entity';
import { JwtService } from '@nestjs/jwt';
import { UserOneAuthEntity } from 'src/users/entities/user-auth.entity';

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
  async getUserRefreshAccess(
    userId: number,
    subId: number = undefined,
  ): Promise<AccessEntity[]> {
    let results: AccessEntity[];
    try {
      const criteria: Prisma.SubscriptionFindManyArgs = {
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
          url: await this.getProtectedUrl(item.appId, item.userId, item.subId),
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
   * It will create a new token each time it is called
   * @param appId
   * @param userId
   * @returns url of the given appId with an authorization token
   */
  async getProtectedUrl(
    userId: number,
    appId: number,
    subId: number,
    role = Role.CLIENT,
  ): Promise<string> {
    let url: string;
    const app: Application = await this.prisma.application.findUnique({
      where: { id: appId },
    });
    if (app) {
      const subTokenUuid = (await this.createSubToken(subId))?.id;

      //we choose a property name of sub to hold our userId value to be consistent with JWT standards
      const appTokenContent: AppTokenContentEntity = {
        sub: userId,
        role: role,
        appId: app.id,
        subTokenUuid,
      };
      const appToken = this.jwtService.sign(appTokenContent);
      url = `${app.baseURL}?appToken=${appToken}`;
    }
    return url;
  }

  /**
   * It will NOT create into the db a new subToken each time it is called
   * BUT it will DO create new tokens if they are missing.
   * BUT It will jwt.signed a new token to update the accessUrlTokenized
   * @return list by subscriptions and then by app an array of one subToken with accessUrl
   */
  async getAccess(user: UserOneAuthEntity): Promise<AccessEntityDetails[]> {
    let access = await this.findManyWithAppsByUserTrimmed(user.id);
    try {
      const missingSubTokens = await this.createManySubTokensIfMissing(access);
      if (missingSubTokens.length > 0) {
        //retrieveToken neo created
        access = await this.findManyWithAppsByUserTrimmed(user.id);
      }

      access.forEach((item) => {
        //we choose a property name of sub to hold our userId value to be consistent with JWT standards
        const appTokenContent: AppTokenContentEntity = {
          sub: user.id,
          role: user.role,
          appId: item.appId,
          subTokenUuid: item.subTokens[0]?.id,
        };
        const baseURL = item.application.baseURL;
        const appToken = this.jwtService.sign(appTokenContent);
        const accessUrlTokenized = `${baseURL}?appToken=${appToken}`;
        item.subTokens[0].accessUrlTokenized = accessUrlTokenized;
      });
    } catch (error) {
      this.logger.error(error);
    }
    return access;
  }

  async createSubToken(subscriptionId: number): Promise<SubToken> {
    let subToken: SubToken;
    try {
      subToken = await this.prisma.subToken.create({
        data: { subscriptionId: subscriptionId },
      });
    } catch (error) {
      this.logger.error(error);
    }
    return subToken;
  }

  /**
   *
   * @param subscriptionsId array of the subId for which it will be created a subToken
   * @returns number of subToken added to the db
   */
  async createManySubTokens(subscriptionsId: number[]): Promise<number> {
    try {
      const data: { subscriptionId: number }[] = [];
      subscriptionsId.forEach((item) => data.push({ subscriptionId: item }));
      const { count } = await this.prisma.subToken.createMany({ data });
      if (subscriptionsId.length > count) {
        throw new Error(
          'addSubTokens : some subToken have not been added to the db.',
        );
      }
      return count;
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * If an user does not have a token to access to an app whereas he has subscribed to it
   * a token (sub token) will be added to the db
   * @param subs can be generated with findManyWithAppsByUser
   * @returns subscriptionId[] which have been added to the db
   */
  async createManySubTokensIfMissing(
    subs: AccessEntityDetails[],
  ): Promise<number[]> {
    const subsToAddToken: number[] = [];
    subs.forEach((element) => {
      if (element.subTokens.length < 1) subsToAddToken.push(element.id);
    });
    if (subsToAddToken.length > 1) {
      await this.createManySubTokens(subsToAddToken);
    }
    return subsToAddToken;
  }

  async findManySubTokens(subscriptionsId: number[]): Promise<SubToken[]> {
    let subTokens: SubToken[];
    try {
      const criteria: Prisma.SubTokenFindManyArgs = {
        where: {
          subscriptionId: {
            in: subscriptionsId,
          },
        },
      };
      subTokens = await this.prisma.subToken.findMany(criteria);
    } catch (error) {
      this.logger.error(error);
    }
    return subTokens;
  }

  async removeSubToken(tokenUuid: string): Promise<boolean> {
    let subToken: SubToken;
    try {
      subToken = await this.prisma.subToken.delete({
        where: {
          id: tokenUuid,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
    this.logger.log(
      `The following token has just expired: ${subToken.id}, it matched with the following user id : ${subToken.subscriptionId}.`,
    );
    return true;
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
      const criteria: Prisma.SubscriptionFindManyArgs = {
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

  async findMany(ids: number[]): Promise<Subscription[]> {
    let result: Subscription[];
    try {
      const criteria: Prisma.SubscriptionFindManyArgs = {
        where: {
          id: {
            in: ids,
          },
        },
      };
      result = await this.prisma.subscription.findMany(criteria);
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  async findManyByUser(userId: number): Promise<Subscription[]> {
    let result: Subscription[];
    try {
      const criteria: Prisma.SubscriptionFindManyArgs = {
        where: {
          userId: {
            equals: userId,
          },
        },
      };
      result = await this.prisma.subscription.findMany(criteria);
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  /**
   * Allow to list all the subscriptions of the given user
   * with the detail of the associated application
   * and the saved tokens to access to it.
   * @returns including the full list of subTokens
   */
  async findManyWithAppsByUser(userId: number): Promise<AccessEntityDetails[]> {
    let result;
    try {
      const criteria: Prisma.SubscriptionFindManyArgs = {
        where: {
          userId: {
            equals: userId,
          },
        },
        orderBy: {
          applications: { name: 'asc' },
        },
        include: {
          subTokens: {
            orderBy: { createdAt: 'asc' },
          },
        },
      };
      result = await this.prisma.subscription.findMany(criteria);
      //renaming applications attribute to application as it is not an array
      result = result.map(({ applications: application, ...res }) => ({
        application,
        ...res,
      }));
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  /**
   * Allow to list all the subscriptions of the given user
   * with the detail of the associated application
   * and the saved tokens to access to it.
   * @returns including a list of subTokens with only one element
   */
  async findManyWithAppsByUserTrimmed(
    userId: number,
  ): Promise<AccessEntityDetails[]> {
    let result: AccessEntityDetails[];
    try {
      result = await this.findManyWithAppsByUser(userId);
      result.forEach((element) => {
        if (element.subTokens.length > 1) {
          const lastItem = element.subTokens.pop();
          element.subTokens = [lastItem];
        }
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
