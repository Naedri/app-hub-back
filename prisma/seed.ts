import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import mockUsers from '../mock/users';

const prisma = new PrismaClient();

async function main() {
  for (const user of mockUsers) {
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
