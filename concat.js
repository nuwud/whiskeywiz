const fs = require('fs');
const concat = require('concat');
const path = require('path');

async function build() {
  try {
    const distPath = 'dist/whiskey-wiz';
    
    // Find the actual filenames
    const files = await fs.readdir(distPath);
    const runtimeFile = files.find(f => f.startsWith('runtime') && f.endsWith('.js'));
    const polyfillsFile = files.find(f => f.startsWith('polyfills') && f.endsWith('.js'));
    const mainFile = files.find(f => f.startsWith('main') && f.endsWith('.js'));

    if (!runtimeFile || !polyfillsFile || !mainFile) {
      throw new Error('Could not find required files');
    }

    const filesToConcat = [
      path.join(distPath, runtimeFile),
      path.join(distPath, polyfillsFile),
      path.join(distPath, mainFile)
    ];
    
    // await fs.ensureDir(path.join(distPath, 'elements'));
    // await concat(filesToConcat, path.join(distPath, 'elements', 'game-elements.js'));
    await fs.ensureDir(path.join(distPath, 'elements'));
    await concat(filesToConcat, path.join(distPath, 'elements', 'game-elements.js'));
    console.log('Successfully created game-elements.js');
  } catch (error) {
    console.error('Error creating game-elements.js:', error);
    process.exit(1);  // Exit with error code
  }
}

build();