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
  AccessEntity,
  AccessEntityDetails,
} from './entities/sub.entity';

@Controller('subs')
@ApiTags('subs')
@UseGuards(MyJwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubsController {
  constructor(private readonly subsService: SubsService) {}

  @Get('access')
  @Roles(Role.CLIENT)
  myAccesses(
    @AuthUser() user: UserOneAuthEntity,
  ): Promise<AccessEntityDetails[]> {
    return this.subsService.getAccess(user);
  }

  @Get('refreshAccess/:userId')
  @Roles(Role.ADMIN)
  myRefreshAccesses(@Param('userId') userId: number): Promise<AccessEntity[]> {
    return this.subsService.getUserRefreshAccess(userId);
  }

  @Get('refreshAccess/:userId/:subId')
  @Roles(Role.ADMIN)
  async myRefreshAccess(
    @Param('userId') userId: number,
    @Param('subId') subId: number,
  ): Promise<AccessEntity> {
    return (await this.subsService.getUserRefreshAccess(userId, +subId))?.pop();
  }

  @Get('sub')
  @Roles(Role.CLIENT)
  mySubscriptions(
    @AuthUser() user: UserNotAuthEntity,
  ): Promise<SubNoUserEntity[]> {
    return this.subsService.getUserSubs(user.id);
  }

  @Get('sub/:id')
  @Roles(Role.CLIENT)
  async mySubscription(
    @AuthUser() user: UserNotAuthEntity,
    @Param('id') subId: number,
  ): Promise<SubNoUserEntity> {
    return (await this.subsService.getUserSubs(user.id, +subId))?.pop();
  }

  @Get('user/:id')
  @Roles(Role.ADMIN)
  userSubscriptions(@Param('id') id: number): Promise<SubNoUserEntity[]> {
    return this.subsService.getUserSubs(+id);
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
