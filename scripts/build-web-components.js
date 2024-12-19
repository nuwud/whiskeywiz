// scripts/build-web-components.js
const fs = require('fs');
const path = require('path');

const buildWebComponents = async () => {
  // Your existing build process
  const result = await ng.build({
    project: 'whiskey-wiz',
    outputPath: 'dist/whiskey-wiz',
    configuration: 'production'
  });

  // Concatenate necessary files
  const files = [
    'runtime.js',
    'polyfills.js',
    'scripts.js',
    'main.js'
  ].map(file => path.join('dist/whiskey-wiz', file));

  const outputFile = path.join('dist', 'whiskey-wiz.js');
  
  // Ensure CORS headers are present
  const combined = files
    .map(file => fs.readFileSync(file, 'utf8'))
    .join('\n');

  fs.writeFileSync(outputFile, combined);
};

buildWebComponents();