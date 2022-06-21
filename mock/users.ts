import { Role } from '@prisma/client';
import { Config } from 'config';

type MockUser = {
  email: string;
  firstName?: string;
  password?: string;
  role?: Role;
};

// const mockUsers = [
const mockUsers: MockUser[] = [
  {
    email: 'alice1@mms.io',
    firstName: 'Alice',
    password: Config.dbPasswordAlt,
  },
  {
    email: Config.dbUser,
    password: Config.dbPassword,
    role: Role.ADMIN,
  },
];

export default mockUsers;
