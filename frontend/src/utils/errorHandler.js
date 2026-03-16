/**
 * Parse error messages from smart contract or chain errors
 */
export const parseError = (error) => {
  if (!error) return 'An unknown error occurred';

  // Handle viem/wagmi errors
  if (error.message) {
    const message = error.message.toLowerCase();

    // Common contract errors
    if (message.includes('only token creator can mint')) {
      return 'Only the token creator can mint this token';
    }
    if (message.includes('amount must be greater than')) {
      return 'Amount must be greater than 0';
    }
    if (message.includes('cannot mint to zero')) {
      return 'Cannot mint to zero address';
    }
    if (message.includes('token is paused')) {
      return 'This token is currently paused and cannot be minted';
    }
    if (message.includes('only token creator or owner can pause')) {
      return 'Only the token creator or contract owner can pause this token';
    }
    if (message.includes('only token holder or owner can burn')) {
      return 'Only the token holder or owner can burn these tokens';
    }
    if (message.includes('user rejected')) {
      return 'You cancelled the transaction in your wallet';
    }
    if (message.includes('user denied')) {
      return 'You denied the transaction in your wallet';
    }
    if (message.includes('insufficient')) {
      return 'Insufficient funds to complete this transaction';
    }
    if (message.includes('gas')) {
      return 'Unable to estimate gas for transaction. Check your inputs';
    }
    if (message.includes('reverted')) {
      return 'Transaction failed. Please verify your inputs and try again';
    }
    if (message.includes('nonce')) {
      return 'Transaction order error. Please try again';
    }
    if (message.includes('timeout')) {
      return 'Transaction timed out. Please try again';
    }
    if (message.includes('network')) {
      return 'Network connection error. Please check your connection';
    }
    if (message.includes('invalid')) {
      return 'Invalid transaction parameters. Please verify your inputs';
    }

    return message.charAt(0).toUpperCase() + message.slice(1);
  }

  return error.toString();
};

/**
 * Format error response for UI display
 */
export const getErrorMessage = (error) => {
  const parsedError = parseError(error);
  return `Error: ${parsedError}`;
};

/**
 * Check if error is a user cancellation
 */
export const isUserRejection = (error) => {
  if (!error) return false;
  const message = error.message || error.toString();
  return (
    message.includes('User rejected') ||
    message.includes('user rejected') ||
    message.includes('User denied')
  );
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error) => {
  if (!error) return false;
  const message = error.message || error.toString();
  return (
    message.includes('network') ||
    message.includes('Network') ||
    message.includes('RPC')
  );
};

/**
 * Check if error is insufficient funds
 */
export const isInsufficientFunds = (error) => {
  if (!error) return false;
  const message = error.message || error.toString();
  return (
    message.includes('insufficient') ||
    message.includes('balance') ||
    message.includes('funds')
  );
};
