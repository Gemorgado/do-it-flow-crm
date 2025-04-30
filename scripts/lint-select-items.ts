
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const SRC = join(process.cwd(), 'src');
const offenders: string[] = [];

// Match both <SelectItem> and <Select.Item>
const regexes = [
  /<SelectItem([^>]*?)>/g,
  /<Select\.Item([^>]*?)>/g
];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]
  );
}

// Get all .tsx files
const tsxFiles = walk(SRC).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));

// Check each file
for (const file of tsxFiles) {
  const code = readFileSync(file, 'utf8');
  
  // Test each regex
  for (const regex of regexes) {
    let match;
    while ((match = regex.exec(code))) {
      const tag = match[0];
      // Check if value is missing, empty, or just whitespace
      if (!/value\s*=/.test(tag) || /value\s*=\s*{?\s*["']\s*["']/.test(tag) || /value\s*=\s*["'][\s]*["']/.test(tag)) {
        const line = code.slice(0, match.index).split('\n').length;
        offenders.push(`${file}:${line} → ${tag.trim()}`);
      }
    }
  }
}

// Report findings
if (offenders.length) {
  console.error('\n❌ SelectItem sem value encontrado em:\n' + offenders.join('\n'));
  process.exit(1);
} else {
  console.log('✅ Nenhum SelectItem vazio encontrado.');
}
