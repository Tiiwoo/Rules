import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { performance } from 'perf_hooks';

export async function build1stream() {
  const start = performance.now();
  const fileUrl =
    'https://raw.githubusercontent.com/1-stream/1stream-public-utils/main/stream.smartdns.list';

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const lines: string[] = [];
    const allLines = text.split('\n');

    for (const line of allLines) {
      const trimmedLine = line.trim();
      if (trimmedLine === '') continue;
      if (trimmedLine.startsWith('# ---------- > China Media')) {
        console.log('Encountered China Media, stopping processing.');
        break; // 遇到 China Media 行，结束循环
      }
      if (
        trimmedLine.startsWith('#nameserver') ||
        trimmedLine.startsWith('# nameserver')
      )
        continue;

      let processedLine = line;
      if (
        line.includes(
          '# > GB:Sky GO /<replace with groupname>SkyGONZ/<replace with groupname>'
        )
      ) {
        processedLine = '# > GB:Sky GO';
      } else if (!line.startsWith('#') && line.startsWith('nameserver')) {
        processedLine = line.split('/')[1];
      }

      lines.push(processedLine);
    }

    await fs.writeFile('./List/non_ip/stream.conf', lines.join('\n'));
    const end = performance.now();
    const elapsed = end - start;
    console.log(`Build 1stream conf time: ${elapsed / 1000}s`);
  } catch (error) {
    console.error('Error building 1stream conf:', error);
  }
}
