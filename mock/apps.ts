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

const jsonR = {
  en: 'To make you braver',
  no: 'Claudine the cat',
} as Prisma.JsonObject;

const mockApps: MockApp[] = [
  {
    name: 'Google',
    landingPage: 'https://about.google/',
    description: jsonG,
    baseURL: 'www.google.com',
    isPublic: false,
  },
  {
    name: 'Bing',
    landingPage: 'https://en.wikipedia.org/wiki/Microsoft_Bing',
    description: jsonB,
    baseURL: 'www.bing.com',
    isPublic: false,
  },
  {
    name: 'DuckDuckGo',
    landingPage: 'https://duckduckgo.com/about',
    description: jsonD,
    baseURL: 'www.duckduckgo.com',
    isPublic: false,
  },
  {
    name: 'Brave',
    landingPage: 'https://brave.com/about',
    description: jsonR,
    baseURL: 'www.brave.com',
    isPublic: true,
  },
];

function getMockApps(): MockApp[] {
  return mockApps;
}

export default getMockApps;
