import { CreateAuthDto } from './dto/create-auth.dto';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenWrapEntity } from './entities/token.entity';
import {
  UserNotAuthEntity,
  UserOneAuthEntity,
} from 'src/users/entities/user-auth.entity';
import { MyJwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/roles/guards/roles.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() { email, password }: CreateAuthDto,
  ): Promise<UserNotAuthEntity> {
    return this.authService.register(email, password);
  }

  @Post('login')
  login(@Body() { email, password }: CreateAuthDto): Promise<TokenWrapEntity> {
    return this.authService.login(email, password);
  }

  @Post('logout')
  @UseGuards(MyJwtAuthGuard)
  @ApiBearerAuth()
  async logout(@AuthUser() user: UserOneAuthEntity): Promise<boolean> {
    return await this.authService.logout(user);
  }

  @Post('logout/:id')
  @UseGuards(MyJwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  async logoutUser(
    @AuthUser() user: UserOneAuthEntity,
    @Param('id') userTokeUuid: string,
  ): Promise<boolean> {
    return await this.authService.logout(user, userTokeUuid);
  }
}
