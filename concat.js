const fs = require('fs-extra');
const concat = require('concat');

async function build() {
  const files = [
    './dist/whiskey-wiz/runtime.js',
    './dist/whiskey-wiz/polyfills.js',
    './dist/whiskey-wiz/main.js'
  ];
  
  await fs.ensureDir('dist/elements');
  await concat(files, 'dist/elements/whiskey-wiz.js');
}

build();