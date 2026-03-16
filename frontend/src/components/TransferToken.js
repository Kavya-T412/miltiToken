import React, { useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../constants/contract';
import { parseError } from '../utils/errorHandler';
import '../styles/TransferToken.css';

const TransferToken = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [tokenId, setTokenId] = useState('');
  const [amount, setAmount] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [isBatch, setIsBatch] = useState(false);
  const [batchIds, setBatchIds] = useState('');
  const [batchAmounts, setBatchAmounts] = useState('');
  const [batchFromAddress, setBatchFromAddress] = useState('');
  const [batchToAddress, setBatchToAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const resetForm = () => {
    setTokenId('');
    setAmount('');
    setFromAddress('');
    setToAddress('');
    setBatchIds('');
    setBatchAmounts('');
    setBatchFromAddress('');
    setBatchToAddress('');
    setIsLoading(false);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!tokenId || !amount || !toAddress) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    const sender = fromAddress || address;
    if (!sender) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    try {
      setIsLoading(true);
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'safeTransferFrom',
        args: [sender, toAddress, BigInt(tokenId), BigInt(amount), '0x'],
      });

      setMessage({ type: 'success', text: `Token transferred successfully! TX: ${tx.slice(0, 10)}...` });
      resetForm();
    } catch (error) {
      console.error('Transfer error:', error);
      setMessage({ type: 'error', text: parseError(error) });
      setIsLoading(false);
    }
  };

  const handleTransferBatch = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!batchIds || !batchAmounts || !batchToAddress) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    const sender = batchFromAddress || address;
    if (!sender) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
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
        functionName: 'safeBatchTransferFrom',
        args: [sender, batchToAddress, ids, amounts, '0x'],
      });

      setMessage({ type: 'success', text: `Batch tokens transferred successfully! TX: ${tx.slice(0, 10)}...` });
      resetForm();
    } catch (error) {
      console.error('Batch transfer error:', error);
      setMessage({ type: 'error', text: parseError(error) });
      setIsLoading(false);
    }
  };

  return (
    <div className="transfer-container">
      <div className="transfer-header">
        <h2>Transfer Tokens</h2>
        <p>Send tokens to another wallet address</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="transfer-toggle">
        <button
          className={`toggle-btn ${!isBatch ? 'active' : ''}`}
          onClick={() => setIsBatch(false)}
        >
          Single Transfer
        </button>
        <button
          className={`toggle-btn ${isBatch ? 'active' : ''}`}
          onClick={() => setIsBatch(true)}
        >
          Batch Transfer
        </button>
      </div>

      {!isBatch ? (
        <form onSubmit={handleTransfer} className="form-container">
          <div className="input-row">
            <div className="form-group">
              <label htmlFor="tokenId">Token ID *</label>
              <input
                id="tokenId"
                type="number"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="Enter token ID"
                disabled={isLoading}
              />
              <small>The ID of the token to transfer</small>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount *</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to transfer"
                disabled={isLoading}
              />
              <small>How many tokens to transfer</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="fromAddress">From Address</label>
            <input
              id="fromAddress"
              type="text"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              placeholder="Leave empty to use connected wallet"
              disabled={isLoading}
            />
            <small>Source address (leave empty to use your connected wallet)</small>
          </div>

          <div className="form-group">
            <label htmlFor="toAddress">To Address *</label>
            <input
              id="toAddress"
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="Enter recipient wallet address"
              disabled={isLoading}
            />
            <small>The wallet address to receive the tokens</small>
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Processing...
              </>
            ) : (
              'Transfer Token'
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleTransferBatch} className="form-container">
          <div className="form-group">
            <label htmlFor="batchIds">Token IDs *</label>
            <input
              id="batchIds"
              type="text"
              value={batchIds}
              onChange={(e) => setBatchIds(e.target.value)}
              placeholder="e.g., 1, 2, 3"
              disabled={isLoading}
            />
            <small>Comma-separated token IDs</small>
          </div>

          <div className="form-group">
            <label htmlFor="batchAmounts">Amounts *</label>
            <input
              id="batchAmounts"
              type="text"
              value={batchAmounts}
              onChange={(e) => setBatchAmounts(e.target.value)}
              placeholder="e.g., 100, 200, 300"
              disabled={isLoading}
            />
            <small>Comma-separated amounts (must match token ID count)</small>
          </div>

          <div className="form-group">
            <label htmlFor="batchFromAddress">From Address</label>
            <input
              id="batchFromAddress"
              type="text"
              value={batchFromAddress}
              onChange={(e) => setBatchFromAddress(e.target.value)}
              placeholder="Leave empty to use connected wallet"
              disabled={isLoading}
            />
            <small>Source address (leave empty to use your connected wallet)</small>
          </div>

          <div className="form-group">
            <label htmlFor="batchToAddress">To Address *</label>
            <input
              id="batchToAddress"
              type="text"
              value={batchToAddress}
              onChange={(e) => setBatchToAddress(e.target.value)}
              placeholder="Enter recipient wallet address"
              disabled={isLoading}
            />
            <small>The wallet address to receive all tokens</small>
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Processing...
              </>
            ) : (
              'Transfer Batch'
            )}
          </button>
        </form>
      )}

      <div className="info-box">
        <h3>Transfer Help</h3>
        <ul>
          <li>Use <strong>Single Transfer</strong> to send one token to a recipient</li>
          <li>Use <strong>Batch Transfer</strong> to send multiple different tokens at once</li>
          <li>The "From Address" field is optional - it defaults to your connected wallet</li>
          <li>Make sure the recipient address is valid before transferring</li>
          <li>You need to own the tokens you're transferring</li>
        </ul>
      </div>
    </div>
  );
};

export default TransferToken;
