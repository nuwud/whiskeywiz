// scripts/create-version.js
const fs = require('fs');
const timestamp = new Date().toISOString();

const version = {
  version: timestamp,
  buildTime: timestamp
};

fs.writeFileSync('dist/whiskey-wiz/version.json', JSON.stringify(version, null, 2));