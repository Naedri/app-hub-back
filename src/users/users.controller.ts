import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { MyJwtAuthGuard } from 'src/auth/jwt.guard';
import { UserNotAuthEntity } from './entities/user-auth.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@UseGuards(MyJwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@AuthUser() user: any): Promise<UserNotAuthEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this.usersService.getById(user.id);
    return result;
  }
}
