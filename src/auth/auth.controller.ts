import { CreateAuthDto } from './dto/create-auth.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TokenWrapEntity } from './entities/token-wrap.entity';
import { UserNotAuthEntity } from 'src/users/entities/user-auth.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: TokenWrapEntity })
  login(@Body() { email, password }: CreateAuthDto) {
    return this.authService.login(email, password);
  }

  @Post('register')
  @ApiOkResponse({ type: UserNotAuthEntity })
  register(@Body() { email, password }: CreateAuthDto) {
    return this.authService.register(email, password);
  }
}
