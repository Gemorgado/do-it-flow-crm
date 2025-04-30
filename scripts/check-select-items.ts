
// ts-node scripts/check-select-items.ts
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SRC = join(__dirname, '..', 'src');
const regex = /<(Select\.Item|SelectItem)([^>]*?)>/g;
const offenders: string[] = [];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]
  );
}

for (const file of walk(SRC).filter(f => f.endsWith('.tsx'))) {
  const code = readFileSync(file, 'utf8');
  let m;
  while ((m = regex.exec(code))) {
    const tag = m[0];
    if (!/value\s*=/.test(tag) || /value\s*=\s*{?\s*["']\s*["']/.test(tag)) {
      const line = code.slice(0, m.index).split('\n').length;
      offenders.push(`${file}:${line}`);
    }
  }
}

if (offenders.length) {
  console.error(
    '\n❌  SelectItem sem value não-vazio encontrado em:\n' +
      offenders.join('\n')
  );
  process.exit(1);
}

console.log('✅  Todos os SelectItem possuem value válido.');
