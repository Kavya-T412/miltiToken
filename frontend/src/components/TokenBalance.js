import React, { useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../constants/contract';
import { parseError } from '../utils/errorHandler';
import '../styles/TokenBalance.css';

const TokenBalance = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: balance, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: [walletAddress, BigInt(tokenId || 0)],
    query: {
      enabled: shouldFetch && !!walletAddress && !!tokenId,
    },
  });

  const handleCheck = (e) => {
    e.preventDefault();

    if (!walletAddress || !tokenId) {
      alert('Please enter both wallet address and token ID');
      return;
    }

    setShouldFetch(true);
  };

  const handleClear = () => {
    setWalletAddress('');
    setTokenId('');
    setShouldFetch(false);
  };

  return (
    <div className="balance-container">
      <div className="balance-header">
        <h2>💰 Check Token Balance</h2>
        <p>View your token holdings</p>
      </div>

      <form onSubmit={handleCheck} className="form-container">
        <div className="form-group">
          <label htmlFor="address">Wallet Address *</label>
          <input
            id="address"
            type="text"
            placeholder="0x..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tokenId">Token ID *</label>
          <input
            id="tokenId"
            type="number"
            placeholder="e.g., 1"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            min="0"
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            {isLoading ? (
              <>
                <span className="spinner"></span> Checking...
              </>
            ) : (
              'Check Balance'
            )}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>

      {shouldFetch && (
        <div className="balance-result">
          {error && (
            <div className="alert alert-error">
              ❌ Error: {parseError(error)}
            </div>
          )}

          {!error && balance !== undefined && (
            <div className="balance-card">
              <div className="balance-info">
                <h3>Token Balance</h3>
                <div className="balance-amount">
                  {balance.toString()}
                </div>
                <div className="balance-details">
                  <p><strong>Wallet:</strong></p>
                  <p className="address">{walletAddress}</p>
                  <p><strong>Token ID:</strong> {tokenId}</p>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="loading-state">
              <span className="spinner"></span>
              <p>Fetching balance...</p>
            </div>
          )}
        </div>
      )}

      <div className="balance-grid">
        <div className="info-card">
          <h4>📊 About Balance</h4>
          <p>Check your current holdings of any token in the KavToken contract. Each token is identified by a unique ID.</p>
        </div>

        <div className="info-card">
          <h4>🔍 How It Works</h4>
          <ul>
            <li>Enter your wallet address</li>
            <li>Enter the token ID you want to check</li>
            <li>View your current balance</li>
          </ul>
        </div>

        <div className="info-card">
          <h4>💡 Tips</h4>
          <ul>
            <li>Use this to verify your token holdings</li>
            <li>Each token is independent with its own ID</li>
            <li>Balance updates after each transaction</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TokenBalance;

