import {
  buildAppleTpl,
  buildAppleCdn,
  buildChnCidr,
  build1stream,
  buildPublic,
} from './build';

import { performance } from 'perf_hooks';

async function buildWithTimer(buildFn: () => Promise<void>, name: string) {
  const start = performance.now();
  console.log(`Start building ${name}...`);
  try {
    await buildFn();
    const end = performance.now();
    const elapsed = end - start;
    console.log(`${name} build done in ${elapsed / 1000}s`);
  } catch (error) {
    console.error(`Error building ${name}:`, error);
    throw error;
  }
}

async function main() {
  const start = performance.now();
  console.log('Start build...');

  try {
    await Promise.all([
      buildWithTimer(buildAppleTpl, 'AppleTpl'),
      buildWithTimer(buildAppleCdn, 'AppleCdn'),
      buildWithTimer(buildChnCidr, 'ChnCidr'),
      buildWithTimer(build1stream, '1stream'),
    ]);

    await buildWithTimer(buildPublic, 'Public');

    console.log('Build done!');
  } catch (error) {
    console.error('Build failed:', error);
    return;
  }

  const end = performance.now();
  const elapsed = end - start;
  console.log(`Total build time: ${elapsed / 1000}s`);
}

main().catch(console.error);
