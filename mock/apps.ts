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
  },
  {
    name: 'Bing',
    landingPage: 'https://en.wikipedia.org/wiki/Microsoft_Bing',
    description: jsonB,
    baseURL: 'www.bing.com',
  },
  {
    name: 'DuckDuckGo',
    landingPage: 'https://duckduckgo.com/about',
    description: jsonD,
    baseURL: 'www.duckduckgo.com',
  },
];

function getMockApps(): MockApp[] {
  return mockApps;
}

export default getMockApps;
