import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, Role, Subscription } from '@prisma/client';
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
import { SubTokensService } from 'src/sub-tokens/sub-tokens.service';
import { throwError } from 'rxjs';

@Injectable()
export class SubsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly subTokensService: SubTokensService,
  ) {
    this.logger = new Logger(this.constructor.name);
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

  /**
   * list all subscriptions of the given user
   * @param userId
   * @param subIds an optional array of id to filter the result
   * @returns
   */
  async getUserSubs(
    userId: number,
    subIds: number[] = [],
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
      if (subIds.length > 0) {
        criteria.where.id = {
          in: subIds,
        };
      }
      results = await this.prisma.subscription.findMany(criteria);
    } catch (error) {
      this.logger.error(error);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return results?.map(({ userId, ...item }) => item);
  }

  /**
   * list all subscriptions of the given user
   * with the detail of the associated application
   * @param userId
   * @param subIds an optional array of id to filter the result
   * @returns
   */
  async getUserSubsWithApps(
    userId: number,
    subIds: number[] = [],
  ): Promise<AccessEntityDetails[]> {
    let result;
    try {
      const criteria: Prisma.SubscriptionFindManyArgs = {
        where: {
          userId: {
            equals: userId,
          },
        },
        include: {
          applications: true,
        },
        orderBy: {
          applications: { name: 'asc' },
        },
      };
      if (subIds.length > 0) {
        criteria.where.id = {
          in: subIds,
        };
      }
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

  /**
   * It will create a new token each time it is called properly
   * and save this token will be saved into the db
   * @param userId
   * @param appId
   * @param role
   * @returns url of the given appId with an authorization token for the given userId
   */
  async getAccessUrl(
    userId: number,
    appId: number,
    role = Role.CLIENT,
  ): Promise<string> {
    try {
      let accessUrlTokenized: string;

      const criteria: Prisma.SubscriptionFindFirstArgs = {
        where: {
          userId: {
            equals: userId,
          },
          appId: {
            equals: appId,
          },
        },
        include: {
          applications: true,
        },
        orderBy: {
          applications: { name: 'asc' },
        },
      };
      const result: any = await this.prisma.subscription.findFirst(criteria);
      if (result !== null) {
        const access: AccessEntityDetails =
          this.subscriptionWithAppsToAccessEntityDetails(result);

        const subToken = await this.subTokensService.create(access.subId);
        if (!subToken?.id) {
          throw new ServiceUnavailableException(
            `Subscription app token was not created for the following subscription id: ${access.subId}`,
          );
        }
        //we choose a property name of sub to hold our userId value to be consistent with JWT standards
        const appTokenContent: AppTokenContentEntity = {
          sub: access.userId,
          subId: access.subId,
          role: role,
          appId: access.appId,
          subTokenUuid: subToken?.id,
        };
        const baseURL = access.application.baseURL;
        const appToken = this.jwtService.sign(appTokenContent);
        accessUrlTokenized = `${baseURL}?appToken=${appToken}`;
      } else {
        throw new UnauthorizedException(
          `User with id : ${userId} is not allowed to access to the application with id : ${appId}.`,
        );
      }
      return accessUrlTokenized;
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * To deal with a Relation queries result from Prisma
   * toward subscriptions including apps
   * @param subWithApp
   * @returns AccessEntityDetails
   */
  subscriptionWithAppsToAccessEntityDetails(
    subWithApp: any,
  ): AccessEntityDetails {
    //renaming id attribute (of the subscription) to subId for better understanding
    subWithApp.subId = subWithApp.id;
    delete subWithApp.id;
    //renaming applications attribute to application as it is not an array
    const access: AccessEntityDetails = undefined;
    delete Object.assign(access, subWithApp, {
      application: subWithApp.applications,
    })['applications'];
    return access;
  }
}
