import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { MyJwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { UserNotAuthEntity } from './entities/user-auth.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@UseGuards(MyJwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(
    @AuthUser() user: UserNotAuthEntity,
  ): Promise<UserNotAuthEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this.usersService.getById(user.id);
    return result;
  }

  @Get('profile/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: number): Promise<UserNotAuthEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this.usersService.getById(+id);
    return result;
  }
}
