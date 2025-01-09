const { execSync } = require('child_process');

function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { encoding: 'utf-8' });
    console.log(output);
  } catch (error) {
    console.error(`Error running ${command}:`, error.message);
  }
}

// Clean npm cache
runCommand('npm cache clean --force');

// Remove node_modules
runCommand('rm -rf node_modules');

// Global package installation
runCommand('npm install -g @angular/cli@latest @nrwl/cli nx firebase-tools');

// Project dependency installation
runCommand('npm ci');

// Verification commands
runCommand('node --version');
runCommand('npm --version');
runCommand('ng version');
runCommand('nx --version');
runCommand('firebase --version');
