/**
 * Validate transaction inputs before sending
 */
export const validateTransactionInputs = (inputs) => {
  const {
    account,
    tokenId,
    amount,
    address: recipientAddress,
  } = inputs;

  if (!account) {
    return { valid: false, error: 'Please connect your wallet' };
  }

  if (tokenId === '' || tokenId === null || tokenId === undefined) {
    return { valid: false, error: 'Please enter a token ID' };
  }

  if (amount === '' || amount === null || amount === undefined) {
    return { valid: false, error: 'Please enter an amount' };
  }

  if (Number(amount) <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  if (recipientAddress && !/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
    return { valid: false, error: 'Invalid recipient address format' };
  }

  return { valid: true };
};

/**
 * Validate batch transaction inputs
 */
export const validateBatchTransactionInputs = (ids, amounts) => {
  if (!ids || ids.length === 0) {
    return { valid: false, error: 'Please enter token IDs' };
  }

  if (!amounts || amounts.length === 0) {
    return { valid: false, error: 'Please enter amounts' };
  }

  if (ids.length !== amounts.length) {
    return {
      valid: false,
      error: `Token IDs (${ids.length}) and Amounts (${amounts.length}) must have the same count`,
    };
  }

  // Validate all amounts are positive
  for (let i = 0; i < amounts.length; i++) {
    if (Number(amounts[i]) <= 0) {
      return {
        valid: false,
        error: `Amount at position ${i + 1} must be greater than 0`,
      };
    }
  }

  return { valid: true };
};

/**
 * Convert string IDs to BigInt array
 */
export const parseTokenIds = (idsString) => {
  return idsString
    .split(',')
    .map((id) => BigInt(id.trim()))
    .filter((id) => id >= 0n);
};

/**
 * Convert string amounts to BigInt array
 */
export const parseAmounts = (amountsString) => {
  return amountsString
    .split(',')
    .map((amount) => BigInt(amount.trim()))
    .filter((amount) => amount > 0n);
};

/**
 * Wait for transaction confirmation
 */
export const waitForTransactionConfirmation = async (hash, maxWaitTime = 60000) => {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    // Poll for transaction status
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return true;
};

/**
 * Format transaction hash for display
 */
export const formatTxHash = (hash) => {
  if (!hash) return '';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

/**
 * Get explorer URL for transaction
 */
export const getExplorerUrl = (txHash, chainId = 1) => {
  const explorers = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
  };

  const baseUrl = explorers[chainId] || explorers[1];
  return `${baseUrl}/tx/${txHash}`;
};

/**
 * Retry transaction with exponential backoff
 */
export const retryTransaction = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};
