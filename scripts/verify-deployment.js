const fetch = require('node-fetch');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const BASE_URL = 'https://whiskeywiz2.web.app';
const SHOPIFY_URL = 'https://blind-barrels.myshopify.com';

async function verifyDeployment() {
  console.log('Starting deployment verification...');
  
  try {
    // 1. Verify main app is responding
    console.log('Checking main app...');
    const mainResponse = await fetch(BASE_URL);
    if (!mainResponse.ok) throw new Error('Main app not responding');
    
    // 2. Check web component availability
    console.log('Checking web components...');
    const wcResponse = await fetch(`${BASE_URL}/elements/game-elements.js`);
    if (!wcResponse.ok) throw new Error('Web components not available');
    
    // 3. Verify CORS headers
    console.log('Checking CORS headers...');
    const corsHeaders = wcResponse.headers.get('access-control-allow-origin');
    if (corsHeaders !== SHOPIFY_URL) {
      throw new Error('CORS headers not properly configured');
    }
    
    // 4. Check Firebase connection
    console.log('Checking Firebase connection...');
    const { stdout } = await execAsync('firebase apps:list');
    if (!stdout.includes('whiskeywiz2')) {
      throw new Error('Firebase app not found');
    }
    
    // 5. Verify environment variables
    console.log('Checking Firebase environment variables...');
    const configOutput = await execAsync('firebase functions:config:get');
    const config = JSON.parse(configOutput.stdout);
    if (!config.shopify || !config.shopify.api_key) {
      throw new Error('Missing required environment variables');
    }
    
    // 6. Cache header verification
    console.log('Checking cache headers...');
    const cacheControl = mainResponse.headers.get('cache-control');
    if (!cacheControl.includes('no-cache')) {
      console.warn('Warning: Cache headers might need review');
    }
    
    console.log('✅ Deployment verification completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Deployment verification failed:', error.message);
    throw error;
  }
}

// Export for use in npm scripts
module.exports = verifyDeployment;

// Run directly if called from command line
if (require.main === module) {
  verifyDeployment().catch(() => process.exit(1));
}