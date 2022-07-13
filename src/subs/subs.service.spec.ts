import { Test, TestingModule } from '@nestjs/testing';
import { AccessEntityDetails } from './entities/sub.entity';
import { SubsService } from './subs.service';

describe('SubsService', () => {
  let service: SubsService;

  // expected results from findManyWithAppsByUser
  const mockNoSubTokens: AccessEntityDetails[] = [
    {
      application: {
        id: 4,
        name: 'Google',
        landingPage: 'https://about.google/',
        description: {
          en: 'To make you better',
          no: 'Claudine the cat',
        },
        baseURL: 'www.google.com',
      },
      id: 4,
      appId: 4,
      userId: 5,
      subTokens: [
        {
          id: '574f5453-9af3-4e9e-be67-f1261a81fb17',
          subscriptionId: 4,
          accessUrlTokenized:
            'www.google.com?appToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsInJvbGUiOiJDTElFTlQiLCJhcHBJZCI6NCwic3ViVG9rZW5VdWlkIjoiNTc0ZjU0NTMtOWFmMy00ZTllLWJlNjctZjEyNjFhODFmYjE3IiwiaWF0IjoxNjU3NzI4NjM0LCJleHAiOjE2NTgzMzM0MzR9.OBON7-m5v3Cd_maDSQNeXdAQ6vII5sKYUQJFdeq6Xvc',
        },
      ],
    },
    {
      application: {
        id: 5,
        name: 'Bing',
        landingPage: 'https://en.wikipedia.org/wiki/Microsoft_Bing',
        description: {
          en: 'To make you stronger',
          no: 'Claudine the cat',
        },
        baseURL: 'www.bing.com',
      },
      id: 5,
      appId: 5,
      userId: 5,
      subTokens: [
        {
          id: '39952f0c-747a-4edb-b964-0fe4c482aadd',
          subscriptionId: 5,
          accessUrlTokenized:
            'www.bing.com?appToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsInJvbGUiOiJDTElFTlQiLCJhcHBJZCI6NSwic3ViVG9rZW5VdWlkIjoiMzk5NTJmMGMtNzQ3YS00ZWRiLWI5NjQtMGZlNGM0ODJhYWRkIiwiaWF0IjoxNjU3NzI4NjM0LCJleHAiOjE2NTgzMzM0MzR9.vHbeR0_EX8N55WsfUoW0JwSkhyvekdv_F-l_mbsMguw',
        },
      ],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubsService],
    }).compile();

    service = module.get<SubsService>(SubsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
