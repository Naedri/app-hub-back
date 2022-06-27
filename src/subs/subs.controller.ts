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
import { UserNotAuthEntity } from 'src/users/entities/user-auth.entity';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { SubEntity } from './entities/sub.entity';
import { AccessEntity } from './entities/access.entity';

@Controller('subs')
@ApiTags('subs')
@UseGuards(MyJwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubsController {
  constructor(private readonly subsService: SubsService) {}

  @Get('myAccess')
  @Roles(Role.CLIENT)
  myAccesses(@AuthUser() user: UserNotAuthEntity): Promise<AccessEntity[]> {
    return this.subsService.getUserAccess(user.id);
  }

  @Get('myAccess/:id')
  @Roles(Role.CLIENT)
  myAccess(
    @AuthUser() user: UserNotAuthEntity,
    @Param('id') id: number,
  ): Promise<AccessEntity[]> {
    return this.subsService.getUserAccess(user.id, id);
  }

  @Get('me/:id')
  @Roles(Role.CLIENT)
  async mySubscription(
    @AuthUser() user: UserNotAuthEntity,
    @Param('id') id: number,
  ): Promise<SubEntity> {
    const result = await this.subsService.getUserSubs(user.id, id);
    return result[0];
  }

  @Get('user/:id')
  @Roles(Role.ADMIN)
  userSubscriptions(@Param('id') id: number): Promise<SubEntity[]> {
    return this.subsService.getUserSubs(id);
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
