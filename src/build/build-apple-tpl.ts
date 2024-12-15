import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { performance } from 'perf_hooks';

export async function buildAppleTpl() {
  const start = performance.now();
  const fileUrl =
    'https://raw.githubusercontent.com/geekdada/surge-list/master/surgio-snippet/apple.tpl';

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const lines = text.split('\n').filter((line) => {
      return !line.startsWith('# http') && line.trim() !== '';
    });
    await fs.writeFile('./List/tpl/apple.tpl', lines.join('\n'));
    const end = performance.now();
    const elapsed = end - start;
    console.log(`Build apple tpl time: ${elapsed / 1000}s`);
  } catch (error) {
    console.error('Error building apple tpl:', error);
  }
}
