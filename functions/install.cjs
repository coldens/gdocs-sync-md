'use strict';

const path = require('node:path');
const { rimraf } = require('rimraf');
const fs = require('node:fs/promises');

/**
 * Prepare the pandoc binary for use in the cloud function.
 */
async function install() {
  const { fetchVersion } = await import('gh-release-fetch');
  await rimraf(path.resolve('./bin'));
  await fetchVersion({
    repository: 'jgm/pandoc',
    package: 'pandoc-3.1.8-linux-amd64.tar.gz',
    destination: 'bin/linux',
    version: '3.1.8',
    extract: true,
  });

  await fs.cp('./bin/linux/pandoc-3.1.8/bin/pandoc', './bin/pandoc');
  await fs.chmod('./bin/pandoc', 0o755);
  await rimraf(path.resolve('./bin/linux'));
}

install().catch(console.error);
