// Utility functions for managing token metadata (URI, creation info, etc.)

const TOKENS_STORAGE_KEY = 'kavtoken_metadata';

/**
 * Save token metadata to localStorage
 * @param {Object} tokenData - { tokenId, uri, amount, recipientAddress, creatorAddress, timestamp }
 */
export const saveTokenMetadata = (tokenData) => {
  try {
    if (!tokenData || !tokenData.creatorAddress) {
      console.error('Invalid token data: missing required fields');
      return false;
    }

    let allTokens = [];
    try {
      const stored = localStorage.getItem(TOKENS_STORAGE_KEY);
      allTokens = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing existing tokens from localStorage:', error);
      allTokens = [];
    }

    // Ensure allTokens is an array
    if (!Array.isArray(allTokens)) {
      allTokens = [];
    }

    // Create a unique key for this token
    const tokenKey = `${tokenData.creatorAddress.toLowerCase()}_${tokenData.tokenId}`;

    // Check if token already exists
    const existingIndex = allTokens.findIndex(
      t => `${(t.creatorAddress || '').toLowerCase()}_${t.tokenId}` === tokenKey
    );

    if (existingIndex !== -1) {
      // Update existing token (add amount)
      allTokens[existingIndex].totalAmount = 
        ((allTokens[existingIndex].totalAmount || 0) + parseInt(tokenData.amount || 0));
      allTokens[existingIndex].lastMintedDate = new Date().toISOString();
      allTokens[existingIndex].mintCount = (allTokens[existingIndex].mintCount || 0) + 1;
    } else {
      // Add new token
      allTokens.push({
        tokenId: tokenData.tokenId,
        uri: tokenData.uri || '',
        totalAmount: parseInt(tokenData.amount || 0),
        recipientAddress: tokenData.recipientAddress || '',
        creatorAddress: tokenData.creatorAddress.toLowerCase(),
        transactionHash: tokenData.transactionHash || '',
        createdDate: new Date().toISOString(),
        lastMintedDate: new Date().toISOString(),
        mintCount: 1,
      });
    }

    localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(allTokens));
    console.log('Token metadata saved successfully:', {
      tokenId: tokenData.tokenId,
      creator: tokenData.creatorAddress
    });
    return true;
  } catch (error) {
    console.error('Error saving token metadata:', error);
    return false;
  }
};

/**
 * Get all tokens created by a specific address
 * @param {string} creatorAddress - The creator's wallet address
 * @returns {Array} Array of token metadata objects
 */
export const getUserTokens = (creatorAddress) => {
  try {
    if (!creatorAddress || typeof creatorAddress !== 'string') {
      console.warn('getUserTokens called with invalid address:', creatorAddress);
      return [];
    }

    const stored = localStorage.getItem(TOKENS_STORAGE_KEY);
    if (!stored) {
      console.log('No tokens found in localStorage for key:', TOKENS_STORAGE_KEY);
      return [];
    }

    let allTokens = [];
    try {
      allTokens = JSON.parse(stored);
    } catch (parseError) {
      console.error('Error parsing tokens from localStorage:', parseError);
      console.log('localStorage content:', stored.substring(0, 200));
      // Clear corrupted data
      localStorage.removeItem(TOKENS_STORAGE_KEY);
      return [];
    }

    if (!Array.isArray(allTokens)) {
      console.warn('Tokens in localStorage is not an array:', typeof allTokens);
      localStorage.removeItem(TOKENS_STORAGE_KEY);
      return [];
    }

    const userAddressLower = creatorAddress.toLowerCase().trim();
    const userTokens = allTokens.filter(token => {
      try {
        const tokenCreator = (token.creatorAddress || '').toLowerCase().trim();
        const matches = tokenCreator === userAddressLower;
        if (matches) {
          console.log(`Token ID ${token.tokenId} matches for creator ${userAddressLower.slice(0, 6)}...`);
        }
        return matches;
      } catch (e) {
        console.error('Error comparing token creator:', e, token);
        return false;
      }
    });

    console.log(`Found ${userTokens.length} tokens for address ${userAddressLower.slice(0, 6)}... out of ${allTokens.length} total`);
    if (userTokens.length > 0) {
      console.log('Token IDs:', userTokens.map(t => t.tokenId));
    }
    return userTokens;
  } catch (error) {
    console.error('Error retrieving user tokens:', error);
    return [];
  }
};

/**
 * Get a specific token metadata
 * @param {string} creatorAddress - The creator's wallet address
 * @param {number} tokenId - The token ID
 * @returns {Object} Token metadata or null
 */
export const getTokenMetadata = (creatorAddress, tokenId) => {
  try {
    const userTokens = getUserTokens(creatorAddress);
    return userTokens.find(t => t.tokenId === tokenId) || null;
  } catch (error) {
    console.error('Error retrieving token metadata:', error);
    return null;
  }
};

/**
 * Update token URI
 * @param {string} creatorAddress - The creator's wallet address
 * @param {number} tokenId - The token ID
 * @param {string} newUri - The new URI
 */
export const updateTokenUri = (creatorAddress, tokenId, newUri) => {
  try {
    let allTokens = JSON.parse(localStorage.getItem(TOKENS_STORAGE_KEY)) || [];
    
    const tokenIndex = allTokens.findIndex(
      t => t.creatorAddress.toLowerCase() === creatorAddress.toLowerCase() && 
           t.tokenId === tokenId
    );
    
    if (tokenIndex !== -1) {
      allTokens[tokenIndex].uri = newUri;
      allTokens[tokenIndex].lastUpdatedDate = new Date().toISOString();
      localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(allTokens));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating token URI:', error);
    return false;
  }
};

/**
 * Delete token metadata
 * @param {string} creatorAddress - The creator's wallet address
 * @param {number} tokenId - The token ID
 */
export const deleteTokenMetadata = (creatorAddress, tokenId) => {
  try {
    let allTokens = JSON.parse(localStorage.getItem(TOKENS_STORAGE_KEY)) || [];
    
    allTokens = allTokens.filter(
      t => !(t.creatorAddress.toLowerCase() === creatorAddress.toLowerCase() && 
             t.tokenId === tokenId)
    );
    
    localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(allTokens));
    return true;
  } catch (error) {
    console.error('Error deleting token metadata:', error);
    return false;
  }
};

/**
 * Format URI for display (handle IPFS, HTTP, etc.)
 * @param {string} uri - The URI to format
 * @returns {string} Formatted URI
 */
export const formatUri = (uri) => {
  if (!uri) return 'No URI provided';
  
  if (uri.startsWith('ipfs://')) {
    // Convert IPFS URI to HTTP gateway
    const hash = uri.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${hash}`;
  }
  
  return uri;
};
