import { Logger, Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { SubTokensService } from 'src/sub-tokens/sub-tokens.service';

@Module({
  providers: [Logger, PrismaService, SubTokensService],
})
export class SubTokensModule {}
