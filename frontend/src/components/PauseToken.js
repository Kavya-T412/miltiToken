import React, { useState, useEffect } from 'react';
import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../constants/contract';
import { parseError } from '../utils/errorHandler';
import '../styles/PauseToken.css';

const PauseToken = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [tokenId, setTokenId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isOwnedToken, setIsOwnedToken] = useState(false);

  const { data: pauseStatus } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'pausedTokens',
    args: [BigInt(tokenId || 0)],
    query: {
      enabled: !!tokenId,
    },
  });

  const { data: tokenCreator } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'tokenCreator',
    args: [BigInt(tokenId || 0)],
    query: {
      enabled: !!tokenId,
    },
  });

  const { data: contractOwner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'owner',
  });

  useEffect(() => {
    if (pauseStatus !== undefined) {
      setIsPaused(pauseStatus);
    }
  }, [pauseStatus]);

  useEffect(() => {
    if (tokenCreator && address) {
      const isCreator = tokenCreator.toLowerCase() === address.toLowerCase();
      const isOwner = contractOwner && contractOwner.toLowerCase() === address.toLowerCase();
      setIsOwnedToken(isCreator || isOwner);
    } else {
      setIsOwnedToken(false);
    }
  }, [tokenCreator, address, contractOwner]);

  const handlePause = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!tokenId) {
      setMessage({ type: 'error', text: 'Please enter a token ID' });
      return;
    }

    if (!isOwnedToken) {
      setMessage({ type: 'error', text: 'You are not the token creator or owner' });
      return;
    }

    if (isPaused) {
      setMessage({ type: 'error', text: 'This token is already paused' });
      return;
    }

    try {
      setIsLoading(true);
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'pauseToken',
        args: [BigInt(tokenId)],
      });
      setMessage({ type: 'success', text: `Token paused successfully! TX: ${tx.slice(0, 10)}...` });
      setIsPaused(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Pause error:', error);
      setMessage({ type: 'error', text: parseError(error) });
      setIsLoading(false);
    }
  };

  const handleUnpause = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!tokenId) {
      setMessage({ type: 'error', text: 'Please enter a token ID' });
      return;
    }

    if (!isOwnedToken) {
      setMessage({ type: 'error', text: 'You are not the token creator or owner' });
      return;
    }

    if (!isPaused) {
      setMessage({ type: 'error', text: 'This token is not paused' });
      return;
    }

    try {
      setIsLoading(true);
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'unpauseToken',
        args: [BigInt(tokenId)],
      });
      setMessage({ type: 'success', text: `Token unpaused successfully! TX: ${tx.slice(0, 10)}...` });
      setIsPaused(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Unpause error:', error);
      setMessage({ type: 'error', text: parseError(error) });
      setIsLoading(false);
    }
  };

  return (
    <div className="pause-container">
      <div className="pause-header">
        <h2>Manage Token Pause Status</h2>
        <p>Control individual token minting availability</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="form-container">
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

        {tokenId && (
          <div className="token-status">
            <div className="status-item">
              <h3>Creator Address</h3>
              <p className="address-display">
                {tokenCreator && tokenCreator !== '0x0000000000000000000000000000000000000000'
                  ? tokenCreator
                  : 'Not yet created'}
              </p>
            </div>

            <div className="status-item">
              <h3>Current Status</h3>
              <div className={`status-badge ${isPaused ? 'paused' : 'active'}`}>
                {isPaused ? 'Paused' : 'Active'}
              </div>
            </div>

            <div className="status-item">
              <h3>Your Role</h3>
              <p>
                {isOwnedToken
                  ? '✓ You can manage this token'
                  : '✗ You cannot manage this token'}
              </p>
            </div>
          </div>
        )}

        <div className="button-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePause}
            disabled={isLoading || !isOwnedToken || isPaused}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Processing...
              </>
            ) : (
              'Pause Token'
            )}
          </button>

          <button
            type="button"
            className="btn btn-success"
            onClick={handleUnpause}
            disabled={isLoading || !isOwnedToken || !isPaused}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Processing...
              </>
            ) : (
              'Unpause Token'
            )}
          </button>
        </div>
      </form>

      <div className="info-box">
        <h3>ℹ️ Pause Functionality</h3>
        <ul>
          <li>Only token creators or contract owner can pause/unpause tokens</li>
          <li>Paused tokens cannot be minted</li>
          <li>Burning and transfers are still allowed for paused tokens</li>
          <li>Use pause to temporarily stop new minting</li>
          <li>Unpause to resume minting operations</li>
        </ul>
      </div>
    </div>
  );
};

export default PauseToken;
