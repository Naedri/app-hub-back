import { Injectable, Logger } from '@nestjs/common';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { App } from './entities/app.entity';

@Injectable()
export class AppsService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {
    this.logger = new Logger(this.constructor.name);
  }

  async discoverOne(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { url, ...result } = await this.findOne(id);
    return result;
  }

  async discoverAll() {
    const results = await this.findAll();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return results.map(({ url, ...item }) => item);
  }

  async create(createAppDto: CreateAppDto) {
    let result;
    try {
      result = await this.prisma.application.create({ data: createAppDto });
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  async findAll(): Promise<App[]> {
    let result;
    try {
      result = await this.prisma.application.findMany({});
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  async findOne(id: number): Promise<App> {
    let result;
    try {
      result = await this.prisma.application.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
    }
    return result;
  }

  async update(id: number, updateAppDto: UpdateAppDto) {
    let result;
    try {
      result = await this.prisma.application.update({
        where: { id },
        data: { ...updateAppDto },
      });
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
