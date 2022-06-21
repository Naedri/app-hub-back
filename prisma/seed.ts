import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import getMockUsers from '../mock/users';

const prisma = new PrismaClient();

async function main() {
  const mockUsers = await getMockUsers();
  for (const user of mockUsers) {
    Logger.log(user);
    await prisma.user.create({ data: user });
  }
}

main()
  .catch((e) => {
    Logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
