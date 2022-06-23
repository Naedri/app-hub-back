//src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Passing the strategy name directly to the AuthGuard() introduces magic strings in the codebase.
 * Instead, we create our own class, as follow :
 */
@Injectable()
export class MyJwtAuthGuard extends AuthGuard('my-jwt') {}
