import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubsService } from './subs.service';
import { CreateSubDto } from './dto/create-sub.dto';
import { UpdateSubDto } from './dto/update-sub.dto';
import { MyJwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { Role, Subscription } from '@prisma/client';
import {
  UserNotAuthEntity,
  UserOneAuthEntity,
} from 'src/users/entities/user-auth.entity';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import {
  SubNoUserEntity,
  AccessEntityDetails,
  AccessUrlEntity,
} from './entities/sub.entity';

@Controller('subs')
@ApiTags('subs')
@UseGuards(MyJwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubsController {
  constructor(private readonly subsService: SubsService) {}

  @Get('myaccess')
  @Roles(Role.CLIENT)
  myAccesses(
    @AuthUser() user: UserOneAuthEntity,
  ): Promise<AccessEntityDetails[]> {
    return this.subsService.getUserSubsWithApps(+user.id);
  }

  @Get('myaccess/:id')
  @Roles(Role.CLIENT)
  async myAccess(
    @AuthUser() user: UserOneAuthEntity,
    @Param('id') subId: number,
  ): Promise<AccessEntityDetails> {
    return (
      await this.subsService.getUserSubsWithApps(+user.id, [+subId])
    )?.pop();
  }

  @Get('myaccess/url/:appId')
  @Roles(Role.CLIENT)
  async myAccessUrl(
    @AuthUser() user: UserOneAuthEntity,
    @Param('appId') appId: number,
  ): Promise<AccessUrlEntity> {
    return {
      accessUrlTokenized: await this.subsService.getAccessUrl(+user.id, +appId),
    };
  }

  @Get('me')
  @Roles(Role.CLIENT)
  mySubs(@AuthUser() user: UserNotAuthEntity): Promise<SubNoUserEntity[]> {
    return this.subsService.getUserSubs(+user.id);
  }

  @Get('me/:id')
  @Roles(Role.CLIENT)
  async mySub(
    @AuthUser() user: UserNotAuthEntity,
    @Param('id') subId: number,
  ): Promise<SubNoUserEntity> {
    return (await this.subsService.getUserSubs(+user.id, [+subId]))?.pop();
  }

  @Get('user/:id')
  @Roles(Role.ADMIN)
  getUserSubs(@Param('id') userId: number): Promise<SubNoUserEntity[]> {
    return this.subsService.getUserSubs(+userId);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createSubDto: CreateSubDto): Promise<Subscription> {
    return this.subsService.create(createSubDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(): Promise<Subscription[]> {
    return this.subsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: number): Promise<Subscription> {
    return this.subsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: number,
    @Body() updateSubDto: UpdateSubDto,
  ): Promise<Subscription> {
    return this.subsService.update(+id, updateSubDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: number) {
    return this.subsService.remove(+id);
  }
}
