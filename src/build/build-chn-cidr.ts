import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { performance } from 'perf_hooks';

type IP_CIDR_String = string;

async function processCIDR(cidr: string): Promise<IP_CIDR_String> {
  return `IP-CIDR,${cidr}`;
}

export async function buildChnCidr() {
  const start = performance.now();
  const fileUrl =
    'https://raw.githubusercontent.com/misakaio/chnroutes2/master/chnroutes.txt';
  const outputFile = './List/ip/china_ip.conf';

  try {
    console.log(`Fetching file from ${fileUrl}...`);
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch file from ${fileUrl}, status: ${response.status}`
      );
    }

    const text = await response.text();
    // 过滤掉注释行和空行
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    console.log(`Processing ${lines.length} lines...`);
    const processedLines: IP_CIDR_String[] = await Promise.all(
      lines.map(processCIDR)
    );

    console.log(`Writing to file ${outputFile}...`);
    await fs.writeFile(outputFile, processedLines.join('\n'));

    const end = performance.now();
    const elapsed = end - start;
    console.log(`Build chn cidr time: ${elapsed / 1000}s`);
  } catch (error) {
    console.error('Error building chn cidr:', error);
  }
}
