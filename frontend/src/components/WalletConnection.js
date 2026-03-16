import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import '../styles/WalletConnection.css';

const WalletConnection = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    console.log('Disconnecting wallet...');
    disconnect();
  };

  const handleConnect = () => {
    if (connectors && connectors.length > 0) {
      console.log('Connecting wallet...');
      connect({ connector: connectors[0] });
    }
  };

  if (isConnected && address) {
    return (
      <div className="wallet-connection-wrapper">
        <div className="wallet-info">
          <div className="address-box" title={address}>
            {address}
          </div>
          <button
            className="wallet-button disconnect"
            onClick={handleDisconnect}
            title="Click to disconnect your wallet"
          >
            🚪 Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connection-wrapper">
      <button
        className="wallet-button connect"
        onClick={handleConnect}
        title="Connect your wallet to start using KavToken"
      >
        💳 Connect Wallet
      </button>
    </div>
  );
};

export default WalletConnection;
