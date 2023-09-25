'use strict';

const path = require('node:path');
const { rimraf } = require('rimraf');
const fs = require('node:fs/promises');

/**
 * Prepare the pandoc binary for use in the cloud function.
 */
async function install() {
  const { fetchVersion } = await import('gh-release-fetch');
  await rimraf(path.resolve('./bin') + '/**/*', {
    glob: {
      ignore: ['.gitignore'],
    },
    preserveRoot: true,
  });
  await fetchVersion({
    repository: 'jgm/pandoc',
    package: 'pandoc-3.1.8-linux-amd64.tar.gz',
    destination: 'bin/linux',
    version: '3.1.8',
    extract: true,
  });

  await fs.cp(
    path.resolve('./bin/linux/pandoc-3.1.8/bin/pandoc'),
    path.resolve('./bin/pandoc'),
  );
  await fs.chmod(path.resolve('./bin/pandoc'), 0o755);
  await rimraf(path.resolve('./bin/linux'));
}

install().catch(console.error);
