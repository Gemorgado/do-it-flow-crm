
// Simple script to execute our validator
import { exec } from 'child_process';

exec('npx ts-node scripts/find-empty-select-items.ts', (error, stdout, stderr) => {
  console.log(stdout);
  if (stderr) console.error(stderr);
  if (error) console.error(`Error: ${error}`);
});
