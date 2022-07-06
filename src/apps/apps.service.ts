import { Injectable, Logger } from '@nestjs/common';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppEntity, AppDiscoverEntity } from './entities/app.entity';

@Injectable()
export class AppsService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {
    this.logger = new Logger(this.constructor.name);
  }

  async discoverOne(id: number): Promise<AppDiscoverEntity> {
    const result = await this.findOne(id);
    delete result?.baseURL;
    return result;
  }

  async discoverAll(): Promise<AppDiscoverEntity[]> {
    const results = await this.findAll();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return results?.map(({ baseURL, ...item }) => item);
  }

  async create(createAppDto: CreateAppDto): Promise<AppEntity> {
    let result;
    try {
      result = await this.prisma.application.create({ data: createAppDto });
      delete result?.secretJWT;
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  async findAll(): Promise<AppEntity[]> {
    let results;
    try {
      results = await this.prisma.application.findMany({});
    } catch (error) {
      this.logger.error(error);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return results?.map(({ secretJWT, ...item }) => item);
  }

  async findOne(id: number): Promise<AppEntity> {
    let result;
    try {
      result = await this.prisma.application.findUnique({
        where: { id },
      });
      delete result?.secretJWT;
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  async update(id: number, updateAppDto: UpdateAppDto): Promise<AppEntity> {
    let result;
    try {
      result = await this.prisma.application.update({
        where: { id },
        data: { ...updateAppDto },
      });
      delete result?.secretJWT;
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  async remove(id: number) {
    let result;
    try {
      result = await this.prisma.application.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }
}
