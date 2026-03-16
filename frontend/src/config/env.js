/**
 * Environment Configuration Validator
 * Validates and provides access to environment variables
 */

// Validate environment on app start
export const validateEnv = () => {
  const errors = [];
  const warnings = [];

  // Check WalletConnect Project ID (critical for production)
  if (!process.env.REACT_APP_WALLETCONNECT_PROJECT_ID) {
    warnings.push(
      '⚠️ REACT_APP_WALLETCONNECT_PROJECT_ID not set. ' +
      'Get one from https://cloud.walletconnect.com/ and add to .env file. ' +
      'The app will work but with limited wallet options.'
    );
  }

  // Check Contract Address
  if (!process.env.REACT_APP_CONTRACT_ADDRESS) {
    warnings.push(
      '⚠️ REACT_APP_CONTRACT_ADDRESS not set. Using fallback address.'
    );
  }

  // Log warnings
  if (warnings.length > 0) {
    warnings.forEach(warning => console.warn(warning));
  }

  // Log errors (if any critical issues)
  if (errors.length > 0) {
    errors.forEach(error => console.error(error));
    throw new Error('Critical environment variables missing. Check console for details.');
  }

  return {
    projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
    appName: process.env.REACT_APP_APP_NAME || 'KavToken',
  };
};

/**
 * Get all environment variables safely
 */
export const getEnvConfig = () => {
  return {
    projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '',
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || '0x701C0cB3e1147E8c4581B2741071e44406e7b90b',
    appName: process.env.REACT_APP_APP_NAME || 'KavToken',
    environment: process.env.NODE_ENV || 'development',
  };
};

/**
 * Check if Project ID is configured
 */
export const isProjectIdConfigured = () => {
  return !!process.env.REACT_APP_WALLETCONNECT_PROJECT_ID;
};
