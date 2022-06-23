import { Injectable, Logger } from '@nestjs/common';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppsService {
  discoverOne(id: number) {
    throw new Error('Method not implemented.');
  }
  discoverAll() {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  async create(createAppDto: CreateAppDto) {
    let result;
    try {
      result = await this.prisma.application.create({ data: createAppDto });
    } catch (error) {
      Logger.error(error);
    }
    return result;
  }

  async findAll() {
    let result;
    try {
      result = await this.prisma.application.findMany({});
    } catch (error) {
      Logger.error(error);
    }
    return result;
  }

  async findOne(id: number) {
    let result;
    try {
      result = await this.prisma.application.findUnique({
        where: { id },
      });
    } catch (error) {
      Logger.error(error);
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
      Logger.error(error);
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
      Logger.error(error);
    }
    return result;
  }
}
