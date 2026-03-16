import React, { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { getUserTokens, formatUri } from '../utils/tokenMetadata';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const [userTokens, setUserTokens] = useState([]);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc');
  const [loading, setLoading] = useState(true);
  const [lastAddress, setLastAddress] = useState(null);

  const loadTokens = useCallback((walletAddress) => {
    if (!walletAddress) {
      setUserTokens([]);
      setFilteredTokens([]);
      return;
    }

    try {
      console.log(`Loading tokens for address: ${walletAddress.slice(0, 6)}...`);
      const tokens = getUserTokens(walletAddress);
      console.log(`Loaded ${tokens.length} tokens`);
      setUserTokens(tokens || []);
    } catch (error) {
      console.error('Error loading tokens:', error);
      setUserTokens([]);
    }
  }, []);

  const applyFiltersAndSort = useCallback((tokens) => {
    if (!tokens || tokens.length === 0) {
      setFilteredTokens([]);
      return;
    }

    let filtered = [...tokens];

    // Filter by search term
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        token =>
          token.tokenId.toString().includes(searchLower) ||
          (token.uri && token.uri.toLowerCase().includes(searchLower)) ||
          (token.recipientAddress && token.recipientAddress.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dateDesc':
          return new Date(b.createdDate || 0) - new Date(a.createdDate || 0);
        case 'dateAsc':
          return new Date(a.createdDate || 0) - new Date(b.createdDate || 0);
        case 'idAsc':
          return (a.tokenId || 0) - (b.tokenId || 0);
        case 'idDesc':
          return (b.tokenId || 0) - (a.tokenId || 0);
        case 'amountDesc':
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        case 'amountAsc':
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        default:
          return 0;
      }
    });

    setFilteredTokens(filtered);
  }, [searchTerm, sortBy]);

  useEffect(() => {
    setLoading(true);
    
    // Address changed (including disconnect/reconnect)
    if (address && isConnected) {
      setLastAddress(address);
      loadTokens(address);
    } else if (!address && lastAddress) {
      // User disconnected
      console.log('Wallet disconnected, clearing tokens');
      setUserTokens([]);
      setLastAddress(null);
    }
    
    setLoading(false);
  }, [address, isConnected, loadTokens, lastAddress]);

  useEffect(() => {
    applyFiltersAndSort(userTokens);
  }, [userTokens, applyFiltersAndSort]);

  // Reload tokens when tab becomes visible or window focused
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && address && isConnected) {
        console.log('Tab became visible, reloading tokens...');
        loadTokens(address);
      }
    };

    const handleFocus = () => {
      if (address && isConnected) {
        console.log('Window focused, reloading tokens...');
        loadTokens(address);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [address, isConnected, loadTokens]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!address) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to view your created tokens</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your tokens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>My NFT Dashboard</h2>
        <p>View and manage all tokens you've created</p>
      </div>

      {userTokens.length === 0 ? (
        <div className="empty-state">

          <h3>No Tokens Created Yet</h3>
          <p>Start by minting your first token in the Mint Tokens section</p>
        </div>
      ) : (
        <>
          <div className="dashboard-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Token ID, URI, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="sort-box">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dateDesc">📅 Newest First</option>
                <option value="dateAsc">📅 Oldest First</option>
                <option value="idAsc">🔢 Token ID (Low to High)</option>
                <option value="idDesc">🔢 Token ID (High to Low)</option>
                <option value="amountDesc">📦 Amount (High to Low)</option>
                <option value="amountAsc">📦 Amount (Low to High)</option>
              </select>
            </div>
          </div>

          <div className="tokens-stats">
            <div className="stat-card">
              <div className="stat-label">Total Tokens Created</div>
              <div className="stat-value">{userTokens.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Mints</div>
              <div className="stat-value">
                {userTokens.reduce((sum, token) => sum + (token.mintCount || 1), 0)}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Supply</div>
              <div className="stat-value">
                {userTokens.reduce((sum, token) => sum + (token.totalAmount || 0), 0).toLocaleString()}
              </div>
            </div>
          </div>

          {filteredTokens.length === 0 ? (
            <div className="no-results">
              <p>No tokens match your search criteria</p>
            </div>
          ) : (
            <div className="tokens-grid">
              {filteredTokens.map((token, index) => (
                <div key={index} className="token-card">
                  <div className="token-card-header">
                    <div className="token-id-badge">ID #{token.tokenId}</div>
                    <div className="token-date">
                      {new Date(token.createdDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className="token-details">
                    <div className="detail-row">
                      <span className="label">Total Supply:</span>
                      <span className="value">{(token.totalAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Mint Count:</span>
                      <span className="value">{token.mintCount || 1}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Created:</span>
                      <span className="value">{formatDate(token.createdDate)}</span>
                    </div>
                    {token.lastMintedDate && (
                      <div className="detail-row">
                        <span className="label">Last Minted:</span>
                        <span className="value">{formatDate(token.lastMintedDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="token-recipients">
                    <div className="recipients-label">Recipients:</div>
                    <div className="recipient-address">
                      <span className="address-value">
                        {token.recipientAddress.slice(0, 6)}...{token.recipientAddress.slice(-4)}
                      </span>
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(token.recipientAddress)}
                        title="Copy address"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="token-uri">
                    {token.uri ? (
                      <>
                        <div className="uri-label">📎 Metadata URI:</div>
                        <div className="uri-content">
                          <a
                            href={formatUri(token.uri)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="uri-link"
                            title={token.uri}
                          >
                            {token.uri.length > 50
                              ? `${token.uri.substring(0, 47)}...`
                              : token.uri}
                          </a>
                          <button
                            className="copy-btn"
                            onClick={() => copyToClipboard(token.uri)}
                            title="Copy URI"
                          >
                            📋
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="no-uri">No metadata URI provided</div>
                    )}
                  </div>

                  {token.transactionHash && (
                    <div className="transaction-info">
                      <small>
                        TX:{' '}
                        <span className="tx-hash">
                          {token.transactionHash.slice(0, 10)}...
                        </span>
                      </small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
