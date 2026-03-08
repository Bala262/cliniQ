/**
 * One-time script: writes entire codebase (excluding generated files) to CODEBASE.md
 * Run: node scripts/dump-codebase.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'CODEBASE.md');

const EXCLUDE_DIRS = ['node_modules', '.next', '.git'];
const EXCLUDE_FILES = ['package-lock.json', 'tsconfig.tsbuildinfo', 'next-env.d.ts', 'CODEBASE.md', '.env.local', '.env'];
const EXCLUDE_EXT = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

function shouldInclude(filePath) {
  const name = path.basename(filePath);
  const ext = path.extname(filePath);
  if (EXCLUDE_FILES.includes(name)) return false;
  if (EXCLUDE_EXT.includes(ext)) return false;
  const rel = path.relative(ROOT, filePath);
  for (const d of EXCLUDE_DIRS) {
    if (rel.startsWith(d + path.sep) || rel === d) return false;
  }
  return true;
}

function* walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(e.name)) {
        yield* walkDir(full);
      }
    } else if (e.isFile() && shouldInclude(full)) {
      yield path.relative(ROOT, full).split(path.sep).join('/');
    }
  }
}

const files = [...walkDir(ROOT)].sort();

const lines = [];
lines.push('# CLINIQ-AI+ — Full Codebase Snapshot');
lines.push('');
lines.push('> Single-file dump of all hand-written source (excludes node_modules, .next, package-lock, next-env.d.ts, assets).');
lines.push('');
lines.push('---');
lines.push('');
lines.push('## File tree');
lines.push('');
lines.push('```');
files.forEach(f => {
  const depth = (f.match(/\//g) || []).length;
  lines.push('  '.repeat(depth) + f);
});
lines.push('```');
lines.push('');
lines.push('---');
lines.push('');

for (const rel of files) {
  const full = path.join(ROOT, rel);
  let content;
  try {
    content = fs.readFileSync(full, 'utf8');
  } catch (e) {
    content = '(read error: ' + e.message + ')';
  }
  const lang = rel.endsWith('.css') ? 'css' : rel.endsWith('.sql') ? 'sql' : rel.endsWith('.json') ? 'json' : rel.endsWith('.md') ? 'markdown' : 'ts';
  lines.push('## `' + rel + '`');
  lines.push('');
  lines.push('```' + lang + '\n' + content + '\n```');
  lines.push('');
}

fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log('Wrote', OUT);
console.log('Files included:', files.length);
