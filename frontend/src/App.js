import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import './App.css';
import MintToken from './components/MintToken';
import BurnToken from './components/BurnToken';
import PauseToken from './components/PauseToken';
import WalletConnection from './components/WalletConnection';
import TokenBalance from './components/TokenBalance';
import Dashboard from './components/Dashboard';

function App() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('mint');

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🪙 KavToken Hub</h1>
          <WalletConnection />
        </div>
      </header>

      <main className="app-main">
        {!isConnected ? (
          <div className="welcome-section">
            <div className="welcome-card">
              <h2>Welcome to KavToken Management</h2>
              <p>Connect your wallet to start managing multi-tokens</p>
              <div className="welcome-features">
                <div className="feature">
                  <span className="feature-icon">🔄</span>
                  <p>Mint Tokens</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔥</span>
                  <p>Burn Tokens</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">⏸️</span>
                  <p>Pause/Unpause</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">💰</span>
                  <p>Check Balance</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">📊</span>
                  <p>View Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="content-section">
              <div className="tabs-container">
                <button
                  className={`tab-button ${activeTab === 'mint' ? 'active' : ''}`}
                  onClick={() => setActiveTab('mint')}
                >
                  🔄 Mint Tokens
                </button>
                <button
                  className={`tab-button ${activeTab === 'burn' ? 'active' : ''}`}
                  onClick={() => setActiveTab('burn')}
                >
                  🔥 Burn Tokens
                </button>
                <button
                  className={`tab-button ${activeTab === 'pause' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pause')}
                >
                  ⏸️ Manage Tokens
                </button>
                <button
                  className={`tab-button ${activeTab === 'balance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('balance')}
                >
                  💰 Check Balance
                </button>
                <button
                  className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  📊 Dashboard
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'mint' && <MintToken />}
                {activeTab === 'burn' && <BurnToken />}
                {activeTab === 'pause' && <PauseToken />}
                {activeTab === 'balance' && <TokenBalance />}
                {activeTab === 'dashboard' && <Dashboard />}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>KavToken @ 2024 | Powered by Web3</p>
      </footer>
    </div>
  );
}

export default App;
