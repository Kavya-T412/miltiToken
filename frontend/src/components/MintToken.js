import React, { useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../constants/contract';
import { saveTokenMetadata } from '../utils/tokenMetadata';
import { parseError } from '../utils/errorHandler';
import '../styles/MintToken.css';

const MintToken = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [tokenId, setTokenId] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [tokenUri, setTokenUri] = useState('');
  const [isBatch, setIsBatch] = useState(false);
  const [batchIds, setBatchIds] = useState('');
  const [batchAmounts, setBatchAmounts] = useState('');
  const [batchUris, setBatchUris] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const resetForm = () => {
    setTokenId('');
    setAmount('');
    setRecipientAddress('');
    setTokenUri('');
    setBatchIds('');
    setBatchAmounts('');
    setBatchUris('');
    setIsLoading(false);
  };

  const handleMint = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!tokenId || !amount || !recipientAddress) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    if (!address) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    try {
      setIsLoading(true);
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mint',
        args: [recipientAddress, BigInt(tokenId), BigInt(amount), '0x'],
      });

      // Save token metadata to localStorage
      saveTokenMetadata({
        tokenId: parseInt(tokenId),
        uri: tokenUri || '',
        amount: parseInt(amount),
        recipientAddress: recipientAddress,
        creatorAddress: address,
        transactionHash: tx,
      });

      setMessage({ type: 'success', text: `Token minted successfully! TX: ${tx.slice(0, 10)}...` });
      resetForm();
    } catch (error) {
      console.error('Mint error:', error);
      setMessage({ type: 'error', text: parseError(error) });
      setIsLoading(false);
    }
  };

  const handleMintBatch = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!batchIds || !batchAmounts || !recipientAddress) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    if (!address) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    try {
      const ids = batchIds.split(',').map(id => BigInt(id.trim()));
      const amounts = batchAmounts.split(',').map(amt => BigInt(amt.trim()));
      const uris = batchUris ? batchUris.split('|').map(uri => uri.trim()) : [];

      if (ids.length !== amounts.length) {
        setMessage({ type: 'error', text: 'Token IDs and Amounts must have the same count' });
        return;
      }

      setIsLoading(true);
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mintBatch',
        args: [recipientAddress, ids, amounts, '0x'],
      });

      // Save metadata for each token in the batch
      ids.forEach((id, index) => {
        saveTokenMetadata({
          tokenId: parseInt(id),
          uri: uris[index] || '',
          amount: parseInt(amounts[index]),
          recipientAddress: recipientAddress,
          creatorAddress: address,
          transactionHash: tx,
        });
      });

      setMessage({ type: 'success', text: `Batch tokens minted successfully! TX: ${tx.slice(0, 10)}...` });
      resetForm();
    } catch (error) {
      console.error('Batch mint error:', error);
      setMessage({ type: 'error', text: parseError(error) });
      setIsLoading(false);
    }
  };

  return (
    <div className="mint-container">
      <div className="mint-header">
        <h2>🔄 Mint New Tokens</h2>
        <p>Create new tokens or mint existing ones</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="mint-toggle">
        <button
          className={`toggle-btn ${!isBatch ? 'active' : ''}`}
          onClick={() => setIsBatch(false)}
        >
          Single Mint
        </button>
        <button
          className={`toggle-btn ${isBatch ? 'active' : ''}`}
          onClick={() => setIsBatch(true)}
        >
          Batch Mint
        </button>
      </div>

      {!isBatch ? (
        <form onSubmit={handleMint} className="form-container">
          <div className="form-group">
            <label htmlFor="recipient">Recipient Address *</label>
            <input
              id="recipient"
              type="text"
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              required
            />
          </div>

          <div className="input-row">
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
            <div className="form-group">
              <label htmlFor="amount">Amount *</label>
              <input
                id="amount"
                type="number"
                placeholder="e.g., 1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tokenUri">Token URI (Metadata URL)</label>
            <input
              id="tokenUri"
              type="text"
              placeholder="e.g., ipfs://QmXxxx or https://example.com/metadata/1.json"
              value={tokenUri}
              onChange={(e) => setTokenUri(e.target.value)}
            />
            <small>Optional: IPFS link or HTTP URL to token metadata</small>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Minting...
              </>
            ) : (
              'Mint Token'
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMintBatch} className="form-container">
          <div className="form-group">
            <label htmlFor="batchRecipient">Recipient Address *</label>
            <input
              id="batchRecipient"
              type="text"
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ids">Token IDs (comma-separated) *</label>
            <input
              id="ids"
              type="text"
              placeholder="e.g., 1,2,3"
              value={batchIds}
              onChange={(e) => setBatchIds(e.target.value)}
              required
            />
            <small>Enter comma-separated token IDs</small>
          </div>

          <div className="form-group">
            <label htmlFor="amounts">Amounts (comma-separated) *</label>
            <input
              id="amounts"
              type="text"
              placeholder="e.g., 100,200,300"
              value={batchAmounts}
              onChange={(e) => setBatchAmounts(e.target.value)}
              required
            />
            <small>Must match the number of token IDs</small>
          </div>

          <div className="form-group">
            <label htmlFor="batchUris">Token URIs (pipe-separated)</label>
            <input
              id="batchUris"
              type="text"
              placeholder="e.g., ipfs://Qmxxx1|ipfs://Qmxxx2|ipfs://Qmxxx3"
              value={batchUris}
              onChange={(e) => setBatchUris(e.target.value)}
            />
            <small>Optional: Separate each token URI with pipe (|). Order must match token IDs.</small>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Minting Batch...
              </>
            ) : (
              'Mint Batch Tokens'
            )}
          </button>
        </form>
      )}

      <div className="info-box">
        <h3>ℹ️ Information</h3>
        <ul>
          <li>Only the token creator can mint tokens with the same ID</li>
          <li>First minter of an ID becomes its creator</li>
          <li>Amount must be greater than 0</li>
          <li>Cannot mint to zero address</li>
          <li>Paused tokens cannot be minted</li>
        </ul>
      </div>
    </div>
  );
};

export default MintToken;
