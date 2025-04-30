
/**
 * Adiciona value="placeholder_x" a todo <Select.Item> que não
 * tem value ou tem value="".
 * Executar com:  npx ts-node scripts/fix-empty-select-items.ts
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]
  );
}

const SRC = join(process.cwd(), 'src');
let patched = 0;

for (const file of walk(SRC).filter(f => f.endsWith('.tsx'))) {
  let code = readFileSync(file, 'utf8');
  const before = code;
  
  // Fix <Select.Item> without value
  code = code.replace(
    /<(Select\.Item|SelectItem)(\s+[^>]*?)?>/g,
    (m) => {
      if (m.includes('value=') && !m.match(/value\s*=\s*{?\s*["']\s*["']/)) return m;
      return m.replace(/<(Select\.Item|SelectItem)/, `<$1 value="placeholder_${++patched}"`);
    }
  );
  
  // Fix value="" or value=''
  code = code.replace(
    /value\s*=\s*{?\s*["']\s*["']/g,
    (m) => m.replace(/["']\s*["']/, `"placeholder_${++patched}"`)
  );
  
  if (code !== before) {
    console.log(`Patching ${file}`);
    writeFileSync(file, code, 'utf8');
  }
}

console.log(`✅  Patches aplicados: ${patched}`);
