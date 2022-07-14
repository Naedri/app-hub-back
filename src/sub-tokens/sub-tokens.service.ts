import { Injectable, Logger, Module } from '@nestjs/common';
import { SubToken, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AccessEntityDetails } from 'src/subs/entities/sub.entity';

@Injectable()
export class SubTokensService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {
    this.logger = new Logger(this.constructor.name);
  }

  async create(subscriptionId: number): Promise<SubToken> {
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
  async createMany(subscriptionsId: number[]): Promise<number> {
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
  async createManyMissing(subs: AccessEntityDetails[]): Promise<number[]> {
    const subsToAddToken: number[] = [];
    subs.forEach((element) => {
      if (element.subTokens.length < 1) subsToAddToken.push(element.subId);
    });
    if (subsToAddToken.length > 1) {
      await this.createMany(subsToAddToken);
    }
    return subsToAddToken;
  }

  async findMany(subscriptionsId: number[]): Promise<SubToken[]> {
    let subTokens: SubToken[];
    try {
      const criteria: Prisma.SubTokenFindManyArgs = {
        where: {
          subscriptionId: {
            in: subscriptionsId,
          },
        },
        orderBy: { createdAt: 'desc' },
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
}
