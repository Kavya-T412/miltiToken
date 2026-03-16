import React, { useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../constants/contract';
import { parseError } from '../utils/errorHandler';
import '../styles/BurnToken.css';

const BurnToken = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [tokenId, setTokenId] = useState('');
  const [amount, setAmount] = useState('');
  const [burnAddress, setBurnAddress] = useState('');
  const [isBatch, setIsBatch] = useState(false);
  const [batchIds, setBatchIds] = useState('');
  const [batchAmounts, setBatchAmounts] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const resetForm = () => {
    setTokenId('');
    setAmount('');
    setBurnAddress('');
    setBatchIds('');
    setBatchAmounts('');
    setIsLoading(false);
  };

  const handleBurn = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!tokenId || !amount) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    const target = burnAddress || address;
    if (!target) {
      setMessage({ type: 'error', text: 'Please connect wallet or provide an address' });
      return;
    }

    try {
      setIsLoading(true);
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'burn',
        args: [target, BigInt(tokenId), BigInt(amount)],
      });
      setMessage({ type: 'success', text: `Tokens burned successfully! TX: ${tx.slice(0, 10)}...` });
      resetForm();
    } catch (error) {
      console.error('Burn error:', error);
      setMessage({ type: 'error', text: parseError(error) });
      setIsLoading(false);
    }
  };

  const handleBurnBatch = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!batchIds || !batchAmounts) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    const target = burnAddress || address;
    if (!target) {
      setMessage({ type: 'error', text: 'Please connect wallet or provide an address' });
      return;
    }

    try {
      const ids = batchIds.split(',').map(id => BigInt(id.trim()));
      const amounts = batchAmounts.split(',').map(amt => BigInt(amt.trim()));

      if (ids.length !== amounts.length) {
        setMessage({ type: 'error', text: 'Token IDs and Amounts must have the same count' });
        return;
      }

      setIsLoading(true);
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'burnBatch',
        args: [target, ids, amounts],
      });
      setMessage({ type: 'success', text: `Batch tokens burned successfully! TX: ${tx.slice(0, 10)}...` });
      resetForm();
    } catch (error) {
      console.error('Batch burn error:', error);
      setMessage({ type: 'error', text: parseError(error) });
      setIsLoading(false);
    }
  };

  return (
    <div className="burn-container">
      <div className="burn-header">
        <h2>Burn Tokens</h2>
        <p>Remove tokens from circulation</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="burn-toggle">
        <button
          className={`toggle-btn ${!isBatch ? 'active' : ''}`}
          onClick={() => setIsBatch(false)}
        >
          Single Burn
        </button>
        <button
          className={`toggle-btn ${isBatch ? 'active' : ''}`}
          onClick={() => setIsBatch(true)}
        >
          Batch Burn
        </button>
      </div>

      {!isBatch ? (
        <form onSubmit={handleBurn} className="form-container">
          <div className="form-group">
            <label htmlFor="burnAddress">Burn from Address (optional - defaults to connected wallet)</label>
            <input
              id="burnAddress"
              type="text"
              placeholder="Leave empty to burn from your wallet"
              value={burnAddress}
              onChange={(e) => setBurnAddress(e.target.value)}
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
              <label htmlFor="amount">Amount to Burn *</label>
              <input
                id="amount"
                type="number"
                placeholder="e.g., 500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Burning...
              </>
            ) : (
              'Burn Token'
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleBurnBatch} className="form-container">
          <div className="form-group">
            <label htmlFor="batchBurnAddress">Burn from Address (optional)</label>
            <input
              id="batchBurnAddress"
              type="text"
              placeholder="Leave empty to burn from your wallet"
              value={burnAddress}
              onChange={(e) => setBurnAddress(e.target.value)}
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

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Burning Batch...
              </>
            ) : (
              'Burn Batch Tokens'
            )}
          </button>
        </form>
      )}

      <div className="info-box">
        <h3>⚠️ Important</h3>
        <ul>
          <li>Burned tokens are permanently removed</li>
          <li>Only token holders or owner can burn tokens</li>
          <li>This action cannot be undone</li>
          <li>You can burn your own tokens or owner can burn any tokens</li>
        </ul>
      </div>
    </div>
  );
};

export default BurnToken;
