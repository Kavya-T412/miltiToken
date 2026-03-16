#!/usr/bin/env node

/**
 * KavToken Frontend - Environment Check Script
 * Verifies that all required environment variables are properly configured
 * 
 * Usage: node scripts/env-check.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 KavToken Environment Configuration Check\n');
console.log('═══════════════════════════════════════════════════════\n');

// Check .env file exists
const envPath = path.join(__dirname, '../.env');
const envLocalPath = path.join(__dirname, '../.env.local');
const envProdPath = path.join(__dirname, '../.env.production.local');

let envFileUsed = null;
let envContent = null;

if (fs.existsSync(envPath)) {
  envFileUsed = '.env';
  envContent = fs.readFileSync(envPath, 'utf-8');
  console.log('✅ Found .env file\n');
} else if (fs.existsSync(envLocalPath)) {
  envFileUsed = '.env.local';
  envContent = fs.readFileSync(envLocalPath, 'utf-8');
  console.log('✅ Found .env.local file\n');
} else if (fs.existsSync(envProdPath)) {
  envFileUsed = '.env.production.local';
  envContent = fs.readFileSync(envProdPath, 'utf-8');
  console.log('✅ Found .env.production.local file\n');
} else {
  console.log('❌ No .env file found!\n');
  console.log('📝 Create one by running: npm run env-setup\n');
  process.exit(1);
}

// Parse environment variables
const lines = envContent.split('\n');
const envVars = {};

lines.forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key) {
      envVars[key.trim()] = (value || '').trim();
    }
  }
});

// Check required variables
const requiredVars = {
  'REACT_APP_WALLETCONNECT_PROJECT_ID': {
    required: false, // Warning if missing, not error
    desc: 'WalletConnect Project ID'
  },
  'REACT_APP_CONTRACT_ADDRESS': {
    required: false,
    desc: 'Smart Contract Address'
  },
  'REACT_APP_APP_NAME': {
    required: false,
    desc: 'Application Name'
  }
};

console.log('📋 Checking Environment Variables:\n');

let hasErrors = false;
let hasWarnings = false;

Object.entries(requiredVars).forEach(([key, config]) => {
  const value = envVars[key];
  const isDefined = value && value.length > 0;

  if (isDefined) {
    const displayValue = value.length > 50 
      ? value.substring(0, 47) + '...' 
      : value;
    console.log(`✅ ${key}`);
    console.log(`   Value: ${displayValue}\n`);
  } else {
    if (config.required) {
      console.log(`❌ ${key} (REQUIRED)`);
      console.log(`   Status: NOT SET\n`);
      hasErrors = true;
    } else {
      console.log(`⚠️  ${key} (OPTIONAL)`);
      console.log(`   Status: NOT SET - will use default\n`);
      hasWarnings = true;
    }
  }
});

// Validate Project ID format if present
const projectId = envVars['REACT_APP_WALLETCONNECT_PROJECT_ID'];
if (projectId) {
  console.log('🔍 Project ID Validation:\n');
  
  if (projectId === 'YOUR_PROJECT_ID' || projectId === 'your_project_id_here') {
    console.log('⚠️  Project ID appears to be a placeholder\n');
    hasWarnings = true;
  } else if (projectId.length < 10) {
    console.log('⚠️  Project ID seems too short\n');
    hasWarnings = true;
  } else {
    console.log('✅ Project ID format looks valid\n');
  }
}

// Validate Contract Address format if present
const contractAddress = envVars['REACT_APP_CONTRACT_ADDRESS'];
if (contractAddress) {
  console.log('🔍 Contract Address Validation:\n');
  
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (ethAddressRegex.test(contractAddress)) {
    console.log('✅ Contract address format is valid\n');
  } else {
    console.log('❌ Contract address format is invalid\n');
    console.log('   Expected: 0x followed by 40 hex characters\n');
    hasErrors = true;
  }
}

// Summary
console.log('═══════════════════════════════════════════════════════\n');
console.log('📊 Summary:\n');

console.log(`Current .env file: ${envFileUsed}\n`);

if (hasErrors) {
  console.log('❌ ERRORS FOUND - Configuration incomplete\n');
  console.log('Actions:');
  console.log('1. Check the errors above');
  console.log('2. Update your .env file');
  console.log('3. Restart development server\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  WARNINGS - Some variables are not set\n');
  console.log('Actions:');
  console.log('1. Add missing optional variables if needed');
  console.log('2. Or restart dev server - defaults will be used\n');
  process.exit(0);
} else {
  console.log('✅ ALL CHECKS PASSED - Ready to run!\n');
  console.log('Next step: npm start\n');
  process.exit(0);
}
