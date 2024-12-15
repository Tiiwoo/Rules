import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { performance } from 'perf_hooks';

export async function buildAppleCdn() {
  const start = performance.now();
  const fileUrl =
    'https://raw.githubusercontent.com/felixonmars/dnsmasq-china-list/master/apple.china.conf';

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const lines = text
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        const s = line.split('/');
        return s[1];
      });
    await fs.writeFile('./List/domainset/apple_cdn.conf', lines.join('\n'));
    const end = performance.now();
    const elapsed = end - start;
    console.log(`Build apple cdn time: ${elapsed / 1000}s`);
  } catch (error) {
    console.error('Error building apple cdn:', error);
  }
}
