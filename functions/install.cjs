'use strict';

const path = require('node:path');
const { rimraf } = require('rimraf');
const fs = require('node:fs/promises');

/**
 * Prepare the pandoc binary for use in the cloud function.
 */
async function install() {
  // Use dynamic imports because it's not compatible with require()
  const { fetchVersion } = await import('gh-release-fetch');

  // Clean up the bin folder
  await rimraf(path.resolve('./bin') + '/**/*', {
    glob: {
      ignore: ['.gitignore'],
    },
    preserveRoot: true,
  });

  // Fetch the specific version of pandoc
  await fetchVersion({
    repository: 'jgm/pandoc',
    package: 'pandoc-3.1.8-linux-amd64.tar.gz',
    destination: 'bin/linux',
    version: '3.1.8',
    extract: true,
  });

  // Copy the binary to the root of the bin folder
  await fs.cp(
    path.resolve('./bin/linux/pandoc-3.1.8/bin/pandoc'),
    path.resolve('./bin/pandoc'),
  );

  // Make the binary executable
  await fs.chmod(path.resolve('./bin/pandoc'), 0o755);

  // Clean up the linux folder
  await rimraf(path.resolve('./bin/linux'));
}

install().catch(console.error);
