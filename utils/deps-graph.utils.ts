import { AppModule } from '../src/app.module';
import { SpelunkerModule } from 'nestjs-spelunker';
import { writeFileSync } from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

const mmdFilePath = './README.assets/deps-graph.mmd';
const diagramType = 'graph LR';

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const treeData = SpelunkerModule.explore(app);
  const root = SpelunkerModule.graph(treeData);
  const edges = SpelunkerModule.findGraphEdges(root);
  const mermaidEdges = edges.map(
    ({ from, to }) => `${from.module.name} --> ${to.module.name}`,
  );

  const content = `${diagramType}\n    ${mermaidEdges.join(';\n    ')};\n`;
  writeFileSync(mmdFilePath, content);
  console.log(`The following file : "${mmdFilePath}" has been overwritten.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
