import * as fs from 'node:fs/promises';
import { walkDir, generateHtml } from '../utils/utils';
import { TreeEntry } from '../types';

export async function buildPublic(): Promise<void> {
  try {
    const listTree = await walkDir('List');
    const scriptTree = await walkDir('Script');
    const modulesTree = await walkDir('Modules');

    let tree: TreeEntry[] = [...listTree, ...scriptTree, ...modulesTree];

    tree.push({ type: 'file', name: 'LICENSE', path: 'LICENSE' });

    const htmlContent = generateHtml(tree);
    await fs.writeFile('./index.html', htmlContent);
    console.log('index.html generated successfully!');
  } catch (err) {
    console.error('Error generating HTML:', err);
  }
}
