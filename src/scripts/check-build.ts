import { execSync } from 'child_process';

const runChecks = () => {
  try {
    // Run type checking
    console.log('Running type check...');
    execSync('tsc --noEmit', { stdio: 'inherit' });

    // Run linting
    console.log('Running linting...');
    execSync('npm run lint', { stdio: 'inherit' });

    // Verify Firebase config
    console.log('Checking Firebase configuration...');
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    console.log('All checks passed! ✅');
    return true;
  } catch (error) {
    console.error('Check failed:', error);
    return false;
  }
};

runChecks();