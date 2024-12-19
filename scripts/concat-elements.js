const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  try {
    const files = [
      './dist/whiskey-wiz/runtime.js',
      './dist/whiskey-wiz/polyfills.js',
      './dist/whiskey-wiz/main.js'
    ];

    await fs.ensureDir('dist/elements');
    await concat(files, 'dist/elements/whiskey-wiz.js');
    
    console.log('Web components built successfully');
  } catch (err) {
    console.error('Error building web components:', err);
    process.exit(1);
  }
})();