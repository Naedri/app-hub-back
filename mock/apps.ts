import { Application, Prisma } from '@prisma/client';

type MockApp = Omit<Application, 'id'>; // App without id

const jsonG = {
  en: 'To make you better',
  no: 'Claudine the cat',
} as Prisma.JsonObject;

const jsonB = {
  en: 'To make you stronger',
  no: 'Claudine the cat',
} as Prisma.JsonObject;

const jsonD = {
  en: 'To make you healthier',
  no: 'Claudine the cat',
} as Prisma.JsonObject;

const mockApps: MockApp[] = [
  {
    name: 'Google',
    landingPage: 'https://about.google/',
    description: jsonG,
    baseURL: 'www.google.com',
    secretJWT: process.env.SEED_APP_JWT_SECRET_G || 'lemon',
  },
  {
    name: 'Bing',
    landingPage: 'https://en.wikipedia.org/wiki/Microsoft_Bing',
    description: jsonB,
    baseURL: 'www.bing.com',
    secretJWT: process.env.SEED_APP_JWT_SECRET_B || 'banana',
  },
  {
    name: 'DuckDuckGo',
    landingPage: 'https://duckduckgo.com/about',
    description: jsonD,
    baseURL: 'www.duckduckgo.com',
    secretJWT: process.env.SEED_APP_JWT_SECRET_D || 'apple',
  },
];

function getMockApps(): MockApp[] {
  return mockApps;
}

export default getMockApps;
