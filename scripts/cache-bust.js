import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, '../frontend/index.html');

const timestamp = Date.now();

let html = readFileSync(htmlPath, 'utf-8');

// Replace version query strings with timestamp
html = html.replace(/\?v=\d+/g, `?v=${timestamp}`);

writeFileSync(htmlPath, html);

console.log(`Cache busted with timestamp: ${timestamp}`);
