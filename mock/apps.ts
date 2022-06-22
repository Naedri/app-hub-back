import { Application } from '@prisma/client';

type MockApp = Omit<Application, 'id'>; // App without id

const mockApps: MockApp[] = [
  {
    url: 'www.google.com',
    name: 'Google',
  },
  {
    url: 'www.bing.com',
    name: 'Bing',
  },
  {
    url: 'www.duckduckgo.com',
    name: 'DuckDuckGo',
  },
];

function getMockApps(): MockApp[] {
  return mockApps;
}

export default getMockApps;
