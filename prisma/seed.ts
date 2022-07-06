import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import getMockUsers from '../mock/users';
import getMockApps from '../mock/apps';

const prisma = new PrismaClient();

async function subscription(userId, appId) {
  const subData = await prisma.subscription.create({
    data: { userId, appId },
  });
  Logger.log(
    `User with id : ${subData.userId} has just subscribed to the app with id : ${subData.appId}.`,
  );
}

async function main() {
  const mockApps = getMockApps();
  for (const app of mockApps) {
    const res = await prisma.application.create({ data: app });
    Logger.log(
      `App with id : ${res.id} and url: ${res.landingPage} has just been created.`,
    );
  }

  const mockUsers = await getMockUsers();
  for (const user of mockUsers) {
    const res = await prisma.user.create({ data: user });
    Logger.log(
      `User with id : ${res.id} and email: ${res.email} has just been created.`,
    );
  }

  let appData = await prisma.application.findUnique({
    where: { name: mockApps[0].name },
  });
  let userData = await prisma.user.findUnique({
    where: { email: mockUsers[0].email },
  });
  subscription(userData.id, appData.id);

  appData = await prisma.application.findUnique({
    where: { name: mockApps[1].name },
  });
  subscription(userData.id, appData.id);

  userData = await prisma.user.findUnique({
    where: { email: mockUsers[1].email },
  });
  subscription(userData.id, appData.id);
}

main()
  .catch((e) => {
    Logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
