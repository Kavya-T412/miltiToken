#!/usr/bin/env node

/**
 * KavToken Frontend - Build Environment Generator
 * Creates .env file from environment variables during build process
 * This script is used by Netlify to generate the .env file from build environment variables
 * 
 * Usage: node scripts/build-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔧 Generating .env file from build environment variables...\n');

// Define required environment variables and their defaults
const envVars = {
  REACT_APP_WALLETCONNECT_PROJECT_ID: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '',
  REACT_APP_CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS || '',
  REACT_APP_APP_NAME: process.env.REACT_APP_APP_NAME || 'KavToken',
};

// Create .env file content
const envContent = Object.entries(envVars)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n') + '\n';

// Write .env file
const envPath = path.join(__dirname, '../.env');

try {
  fs.writeFileSync(envPath, envContent, 'utf-8');
  console.log('✅ .env file generated successfully\n');
  console.log('📄 Environment variables configured:');
  Object.entries(envVars).forEach(([key, value]) => {
    const displayValue = value ? '✓ set' : '⚠ not set';
    console.log(`   ${key}: ${displayValue}`);
  });
  console.log('\n');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
}
