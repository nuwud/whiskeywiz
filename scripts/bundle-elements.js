const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src/app/elements/game-bundle.js');
const destDir = path.join(__dirname, '../dist/whiskey-wiz/elements');
const destPath = path.join(destDir, 'game-elements.js');

// Create elements directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy the bundle file
fs.copyFileSync(srcPath, destPath);

console.log('Web components bundle created successfully!');
