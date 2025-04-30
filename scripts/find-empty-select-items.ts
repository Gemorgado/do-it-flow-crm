
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const SRC = join(process.cwd(), 'src');
const offenders: string[] = [];
const regex = /<Select\.Item([^>]*?)>/g;

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e =>
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
      offenders.push(`${file}:${line} → ${tag.trim()}`);
    }
  }
}

if (offenders.length) {
  console.error('\n❌ Select.Item sem value encontrado em:\n' + offenders.join('\n'));
  process.exit(1);
} else {
  console.log('✅ Nenhum Select.Item vazio encontrado.');
}
