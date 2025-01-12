import { execSync } from 'child_process';
import { getAuth } from 'firebase/auth';
import { app } from '../lib/firebase';

const deployChecklist = async () => {
  try {
    // 1. Verify environment
    console.log('🔍 Verifying environment...');
    const auth = getAuth(app);
    await auth.tenantId; // Simple check to verify Firebase initialization

    // 2. Clean build directories
    console.log('🧹 Cleaning build directories...');
    execSync('npm run clean', { stdio: 'inherit' });

    // 3. Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // 4. Run checks
    console.log('✅ Running pre-deployment checks...');
    execSync('ts-node src/scripts/check-build.ts', { stdio: 'inherit' });

    // 5. Build
    console.log('🏗️ Building project...');
    execSync('npm run build', { stdio: 'inherit' });

    // 6. Deploy
    console.log('🚀 Deploying to Firebase...');
    execSync('firebase deploy', { stdio: 'inherit' });

    console.log('✨ Deployment complete!');
    return true;
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    return false;
  }
};

deployChecklist();
