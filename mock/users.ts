import { Role } from '@prisma/client';

// database product seed
const dbUser = process.env.SEED_USER; // admin email
const dbPassword = process.env.SEED_PASSWORD; // admin password
const dbPasswordAlt = process.env.SEED_PASSWORD_ALT; // non admin password

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
    password: dbPasswordAlt,
  },
  {
    email: dbUser,
    password: dbPassword,
    role: Role.ADMIN,
  },
];

export default mockUsers;
