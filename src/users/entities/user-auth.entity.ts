import { Role, User } from '@prisma/client';
import { TokenWrapEntity } from 'src/auth/entities/token-wrap.entity';

type IUserAuth = Omit<User, 'password' | 'tokenList'>; // User without password

export class UserAuthEntity implements IUserAuth, TokenWrapEntity {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string;
}

export class UserNotAuthEntity implements IUserAuth {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export class UserOneAuthEntity {
  id: number;
  role: Role;
  tokenUuid: string;
}
