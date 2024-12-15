import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { TreeEntry } from '../types';

// Priority Sorter
const priorityOrder: { [key: string]: number } = {
  domainset: 1,
  non_ip: 2,
  ip: 3,
  tpl: 4,
  List: 10,
  Modules: 13,
  Script: 14,
  LICENSE: 20,
};

function prioritySorter(entries: TreeEntry[]): void {
  entries.sort((a, b) => {
    if (a.type === 'directory' && b.type !== 'directory') {
      return -1;
    }
    if (a.type !== 'directory' && b.type === 'directory') {
      return 1;
    }
    if (a.type === 'directory' && b.type === 'directory') {
      const priorityA = priorityOrder[a.name] || Infinity;
      const priorityB = priorityOrder[b.name] || Infinity;
      return priorityA - priorityB;
    }
    return a.name.localeCompare(b.name);
  });
}

// Walk Directory
async function walkDir(dirPath: string): Promise<TreeEntry[]> {
  try {
    const fileInfo = await fs.stat(dirPath);
    const entry: TreeEntry = {
      name: path.basename(dirPath),
      path: dirPath,
      type: fileInfo.isDirectory() ? 'directory' : 'file',
    };
    let entries: TreeEntry[] = [];

    if (fileInfo.isDirectory()) {
      const files = await fs.readdir(dirPath);
      entry.children = [];
      for (const file of files) {
        if (file === '.gitkeep') {
          continue;
        }
        const children = await walkDir(path.join(dirPath, file));
        entry.children.push(...children);
      }
    }
    if (
      entry.type === 'directory' &&
      (!entry.children || entry.children.length === 0)
    ) {
      return entries;
    }
    entries.push(entry);
    return entries;
  } catch (err) {
    console.error(`Error walking directory ${dirPath}:`, err);
    return [];
  }
}

// Walk Tree
function walk(tree: TreeEntry[]): string {
  let result = '';
  prioritySorter(tree);
  for (const entry of tree) {
    if (entry.type === 'directory') {
      result += `<li class="folder">${entry.name}`;
      result += '<ul>';
      result += walk(entry.children || []);
      result += '</ul></li>';
    } else if (entry.name !== 'index.html') {
      result += `<li><a class="file directory-list-file" href="${entry.path}">${entry.name}</a></li>`;
    }
  }
  return result;
}

// Generate HTML
function generateHtml(tree: TreeEntry[]): string {
  const currentTime = new Date().toISOString();
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Surge Ruleset Server | Tiiwoo (@Tiiwoo)</title>
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
    <link href="https://cdn.skk.moe/favicon.ico" rel="icon" type="image/ico">
    <link href="https://cdn.skk.moe/favicon/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180">
    <link href="https://cdn.skk.moe/favicon/android-chrome-192x192.png" rel="icon" type="image/png" sizes="192x192">
    <link href="https://cdn.skk.moe/favicon/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32">
    <link href="https://cdn.skk.moe/favicon/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16">
    <meta name="description" content="Tiiwoo 自用的 Surge 规则组">

    <link rel="stylesheet" href="https://cdn.skk.moe/ruleset/css/21d8777a.css" />

    <meta property="og:title" content="Surge Ruleset | Tiiwoo (@Tiiwoo)">
    <meta property="og:type" content="Website">
    <meta property="og:url" content="https://rules.tiiwoo.moe/">
    <meta property="og:image" content="https://cdn.skk.moe/favicon/android-chrome-192x192.png">
    <meta property="og:description" content="Tiiwoo 自用的 Surge 规则组">
    <meta name="twitter:card" content="summary">
    <link rel="canonical" href="https://rules.tiiwoo.moe/">
</head>
<body>
    <main class="container">
        <h1>Surge Ruleset Server</h1>
		<p>
      		Made by <a href="https://tiiwoo.moe">Tiiwoo</a> | <a href="https://github.com/Tiiwoo/Rules/">Source @ GitHub</a> | Licensed under <a href="LICENSE" target="_blank">AGPL-3.0</a>
    	</p>
		<p>Last Build: ${currentTime}</p>
        <ul class="directory-list">`;

  const content = walk(tree);

  const endHtml = `</ul>
    </main>
</body>
</html>`;

  return html + content + endHtml;
}

export { prioritySorter, walkDir, walk, generateHtml };
