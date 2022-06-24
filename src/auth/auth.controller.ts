import { CreateAuthDto } from './dto/create-auth.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { TokenWrapEntity } from './entities/token-wrap.entity';
import { UserNotAuthEntity } from 'src/users/entities/user-auth.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() { email, password }: CreateAuthDto): Promise<TokenWrapEntity> {
    return this.authService.login(email, password);
  }

  @Post('register')
  register(
    @Body() { email, password }: CreateAuthDto,
  ): Promise<UserNotAuthEntity> {
    return this.authService.register(email, password);
  }
}
