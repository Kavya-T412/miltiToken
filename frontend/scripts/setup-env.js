#!/usr/bin/env node

/**
 * KavToken Frontend - Environment Setup Helper
 * Interactively helps create and configure .env file
 * 
 * Usage: node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

console.log('\n🚀 KavToken Environment Setup\n');
console.log('═══════════════════════════════════════════════════════\n');

// Function to prompt user
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

const setupEnv = async () => {
  try {
    // Check if .env already exists
    if (fs.existsSync(envPath)) {
      console.log('📄 .env file already exists\n');
      const overwrite = await prompt('Do you want to reconfigure it? (yes/no): ');
      
      if (overwrite.toLowerCase() !== 'yes' && overwrite.toLowerCase() !== 'y') {
        console.log('\n✅ Setup cancelled. Using existing .env\n');
        rl.close();
        return;
      }
    }

    console.log('\n📝 Enter your configuration details\n');
    console.log('Note: Press Enter to skip optional fields\n');

    // Get WalletConnect Project ID
    console.log('1️⃣ WalletConnect Project ID (Required*)');
    console.log('   Get it from: https://cloud.walletconnect.com/\n');
    const projectId = await prompt('   Project ID: ');

    if (!projectId && projectId.trim() === '') {
      console.log('\n⚠️  Project ID is recommended for production\n');
    }

    // Get Contract Address
    console.log('\n2️⃣ Smart Contract Address (Optional)');
    console.log('   Defaults to: 0x701C0cB3e1147E8c4581B2741071e44406e7b90b\n');
    const contractAddress = await prompt('   Contract Address (press Enter for default): ');

    // Get App Name
    console.log('\n3️⃣ Application Name (Optional)');
    console.log('   Defaults to: KavToken\n');
    const appName = await prompt('   App Name (press Enter for default): ');

    // Create .env content
    let envContent = '';

    envContent += `# WalletConnect Configuration\n`;
    envContent += `REACT_APP_WALLETCONNECT_PROJECT_ID=${projectId || 'your_project_id_here'}\n\n`;

    envContent += `# Smart Contract Configuration\n`;
    envContent += `REACT_APP_CONTRACT_ADDRESS=${contractAddress || '0x701C0cB3e1147E8c4581B2741071e44406e7b90b'}\n\n`;

    envContent += `# Application Configuration\n`;
    envContent += `REACT_APP_APP_NAME=${appName || 'KavToken'}\n`;

    // Write .env file
    fs.writeFileSync(envPath, envContent);

    console.log('\n═══════════════════════════════════════════════════════\n');
    console.log('✅ .env file created successfully!\n');
    console.log('📍 Location: .env\n');
    console.log('📋 Configuration Summary:\n');

    if (projectId) {
      const displayProjectId = projectId.length > 40 
        ? projectId.substring(0, 37) + '...' 
        : projectId;
      console.log(`   ✅ Project ID: ${displayProjectId}`);
    } else {
      console.log(`   ⚠️  Project ID: Not set (placeholder)`);
    }

    console.log(`   ✅ Contract Address: ${contractAddress || '(default)'}`);
    console.log(`   ✅ App Name: ${appName || '(default)'}\n`);

    console.log('🚀 Next Steps:\n');
    console.log('   1. If you didn\'t add Project ID, get one from:');
    console.log('      https://cloud.walletconnect.com/\n');
    console.log('   2. Edit .env file and add the Project ID\n');
    console.log('   3. Run: npm start\n');

    console.log('✨ Setup complete!\n');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

setupEnv();
