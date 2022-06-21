import { CreateAuthDto } from './dto/create-auth.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from './entities/auth.entity';
import { UserNotAuth } from 'src/users/entities/user-auth.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: Auth })
  login(@Body() { email, password }: CreateAuthDto) {
    return this.authService.login(email, password);
  }

  @Post('register')
  @ApiOkResponse({ type: UserNotAuth })
  register(@Body() { email, password }: CreateAuthDto) {
    return this.authService.register(email, password);
  }
}
