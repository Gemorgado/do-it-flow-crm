
// Script to execute our validator and find any empty SelectItems
import { exec } from 'child_process';

console.log('Running SelectItem validation...');

exec('npx ts-node scripts/find-empty-select-items.ts', (error, stdout, stderr) => {
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
  
  if (error) {
    console.error(`Error: ${error}`);
    console.log('\nRunning fix script to correct the issues...');
    
    // Try to automatically fix any empty SelectItems found
    exec('npx ts-node scripts/fix-empty-select-items.ts', (fixError, fixStdout, fixStderr) => {
      if (fixStdout) console.log(fixStdout);
      if (fixStderr) console.error(fixStderr);
      
      if (fixError) {
        console.error('Failed to fix all issues automatically. Please check your code manually.');
      } else {
        console.log('Fixed SelectItem issues successfully!');
      }
    });
  } else {
    console.log('No SelectItem validation issues found.');
  }
});
