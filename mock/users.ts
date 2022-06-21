import { Role } from '@prisma/client';
import { hash } from 'bcrypt';

type MockUser = {
  email: string;
  firstName?: string;
  password?: string;
  role?: Role;
};

const config = {
  saltRounds: parseInt(process.env.HASH_ROUND || '10', 10),
  dbUser: process.env.SEED_USER || 'superUser', // admin email
  dbPassword: process.env.SEED_PASSWORD || 'superPwd', // admin password
  dbPasswordAlt: process.env.SEED_PASSWORD_ALT || 'user', // non admin password
};

function hashingPassword(user: MockUser): Promise<string> {
  if (user.password) {
    return hash(user.password, config.saltRounds);
  }
}

const mockUsers: MockUser[] = [
  {
    email: 'alice1@mms.io',
    firstName: 'Alice',
    password: config.dbPasswordAlt,
  },
  {
    email: config.dbUser,
    password: config.dbPassword,
    role: Role.ADMIN,
  },
];

async function getMockUsers(): Promise<MockUser[]> {
  const promises: Promise<MockUser>[] = mockUsers.map(async (user) => {
    user.password = await hashingPassword(user);
    return user;
  });
  return Promise.all(promises);
}

export default getMockUsers;
