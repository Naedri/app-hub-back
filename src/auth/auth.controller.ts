import { CreateAuthDto } from './dto/create-auth.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenWrapEntity } from './entities/token-wrap.entity';
import {
  UserNotAuthEntity,
  UserOneAuthEntity,
} from 'src/users/entities/user-auth.entity';
import { MyJwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('register')
  register(
    @Body() { email, password }: CreateAuthDto,
  ): Promise<UserNotAuthEntity> {
    return this.authService.register(email, password);
  }
}
