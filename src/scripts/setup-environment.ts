import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const setupEnvironment = async () => {
  try {
    console.log('🔧 Setting up development environment...');

    // 1. Create necessary directories
    const dirs = [
      'src/components',
      'src/lib',
      'src/contexts',
      'src/hooks',
      'src/types',
      'src/utils'
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    });

    // 2. Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // 3. Set up environment variables
    if (!fs.existsSync('.env.local') && fs.existsSync('.env.example')) {
      fs.copyFileSync('.env.example', '.env.local');
      console.log('✅ Created .env.local from example');
    }

    // 4. Initialize Git hooks
    console.log('🎣 Setting up Git hooks...');
    execSync('npx husky install', { stdio: 'inherit' });

    // 5. Check MCP services
    console.log('🔍 Verifying MCP services...');
    execSync('ts-node src/scripts/mcp-checks.ts', { stdio: 'inherit' });

    console.log('\n✨ Environment setup complete!');
    return true;
  } catch (error) {
    console.error('❌ Environment setup failed:', error);
    return false;
  }
};

setupEnvironment();
