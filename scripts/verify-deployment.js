const fetch = require('node-fetch');
const { execSync } = require('child_process');

const BASE_URL = 'https://whiskeywiz2.web.app';
const SHOPIFY_URL = 'https://blind-barrels.myshopify.com';

async function verifyDeployment() {
  console.log('🔍 Starting deployment verification...');
  
  try {
    // 1. Verify Firebase config
    console.log('Checking Firebase config...');
    const config = JSON.parse(execSync('firebase functions:config:get').toString());
    if (!config.shopify || !config.shopify.api_key) {
      throw new Error('Missing Shopify configuration');
    }

    // 2. Check build directory
    console.log('Checking build directory...');
    const buildExists = require('fs').existsSync('./dist/whiskey-wiz');
    if (!buildExists) {
      throw new Error('Build directory not found. Run npm run build first.');
    }

    // 3. Check web components bundle
    console.log('Checking web components bundle...');
    const wcExists = require('fs').existsSync('./dist/whiskey-wiz/elements/game-elements.js');
    if (!wcExists) {
      throw new Error('Web components bundle not found. Run npm run build:elements first.');
    }

    console.log('✅ Pre-deployment verification completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

// Run verification
verifyDeployment();
