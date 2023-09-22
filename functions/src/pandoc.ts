import { spawn } from 'child_process';
import path = require('node:path');

export function convertToMarkdown(content: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const pandocPath = path.resolve('./pandoc'); // Pandoc's path

    // Run as a secondary process
    const pandocProcess = spawn(pandocPath, ['--from=rtf', '--to=markdown'], {
      stdio: ['pipe', 'pipe', 'inherit'],
    });

    let output = '';

    // concat the output
    pandocProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    // control error
    pandocProcess.on('error', (error) => {
      reject(error);
    });

    // finished event
    pandocProcess.on('close', (code) => {
      if (code === 0) {
        // resolves the promise
        resolve(output);
      } else {
        reject(new Error(`pandoc process exited with code ${code}`));
      }
    });

    pandocProcess.stdin.write(content);
    pandocProcess.stdin.end();
  });
}
