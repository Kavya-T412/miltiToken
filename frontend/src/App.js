import React, { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import './App.css';
import MintToken from './components/MintToken';
import BurnToken from './components/BurnToken';
import PauseToken from './components/PauseToken';
import TransferToken from './components/TransferToken';
import WalletConnection from './components/WalletConnection';
import TokenBalance from './components/TokenBalance';
import Dashboard from './components/Dashboard';

function App() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [activeTab, setActiveTab] = useState('mint');

  const handleConnectWallet = () => {
    if (connectors && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">KavToken Hub</h1>
          <WalletConnection />
        </div>
      </header>

      <main className="app-main">
        {!isConnected ? (
          <>
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                <h1>Advanced Token Management Platform</h1>
                <p className="hero-subtitle">Create, manage, and control multi-token ecosystems with enterprise-grade security and simplicity</p>
                <div className="hero-cta">
                  <button className="btn btn-primary btn-large" onClick={handleConnectWallet}>Connect Wallet to Get Started</button>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
              <div className="section-header">
                <h2>Powerful Features</h2>
                <p>Everything you need to manage tokens efficiently</p>
              </div>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-number">01</div>
                  <h3>Mint Tokens</h3>
                  <p>Create and issue new tokens with flexible parameters. Mint single or batch tokens with ease.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-number">02</div>
                  <h3>Burn Tokens</h3>
                  <p>Remove tokens from circulation permanently. Reduce supply and increase scarcity with one click.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-number">03</div>
                  <h3>Transfer Tokens</h3>
                  <p>Send tokens to any wallet address. Support for single and batch transfers.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-number">04</div>
                  <h3>Manage Pause</h3>
                  <p>Control token minting availability. Pause individual tokens with granular control.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-number">05</div>
                  <h3>Balance Check</h3>
                  <p>Monitor your token balances in real-time. Track all holdings across your portfolio.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-number">06</div>
                  <h3>Dashboard Analytics</h3>
                  <p>Comprehensive dashboard to view and analyze all your created tokens and transactions.</p>
                </div>
              </div>
            </section>

            {/* Features Grid (Old Welcome Card) */}
            <section className="highlights-section">
              <div className="section-header">
                <h2>Complete Token Lifecycle Management</h2>
              </div>
              <div className="welcome-features">
                <div className="feature">
                  <p>Mint Tokens</p>
                </div>
                <div className="feature">
                  <p>Burn Tokens</p>
                </div>
                <div className="feature">
                  <p>Pause/Unpause</p>
                </div>
                <div className="feature">
                  <p>Transfer Tokens</p>
                </div>
                <div className="feature">
                  <p>Check Balance</p>
                </div>
                <div className="feature">
                  <p>View Dashboard</p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
              <h2>Ready to Get Started?</h2>
              <p>Join thousands of users managing tokens on KavToken Hub</p>
              <button className="btn btn-primary btn-large" onClick={handleConnectWallet}>Connect Your Wallet Now</button>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
              <div className="footer-content">
                <div className="footer-section">
                  <h4>About</h4>
                  <p>KavToken Hub is the leading platform for token management and creation.</p>
                </div>
                <div className="footer-section">
                  <h4>Features</h4>
                  <ul>
                    <li>Token Minting</li>
                    <li>Token Burning</li>
                    <li>Token Transfer</li>
                    <li>Analytics</li>
                  </ul>
                </div>
                <div className="footer-section">
                  <h4>Support</h4>
                  <ul>
                    <li>Documentation</li>
                    <li>Contact Us</li>
                    <li>FAQ</li>
                    <li>Community</li>
                  </ul>
                </div>
                <div className="footer-section">
                  <h4>Legal</h4>
                  <ul>
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                    <li>Disclaimer</li>
                  </ul>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2026 KavToken Hub. All rights reserved.</p>
              </div>
            </footer>
          </>
        ) : (
          <>
            <div className="content-section">
              <div className="tabs-container">
                <button
                  className={`tab-button ${activeTab === 'mint' ? 'active' : ''}`}
                  onClick={() => setActiveTab('mint')}
                >
                  Mint Tokens
                </button>
                <button
                  className={`tab-button ${activeTab === 'burn' ? 'active' : ''}`}
                  onClick={() => setActiveTab('burn')}
                >
                  Burn Tokens
                </button>
                <button
                  className={`tab-button ${activeTab === 'pause' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pause')}
                >
                  Manage Tokens
                </button>
                <button
                  className={`tab-button ${activeTab === 'transfer' ? 'active' : ''}`}
                  onClick={() => setActiveTab('transfer')}
                >
                  Transfer Tokens
                </button>
                <button
                  className={`tab-button ${activeTab === 'balance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('balance')}
                >
                  Check Balance
                </button>
                <button
                  className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'mint' && <MintToken />}
                {activeTab === 'burn' && <BurnToken />}
                {activeTab === 'pause' && <PauseToken />}
                {activeTab === 'transfer' && <TransferToken />}
                {activeTab === 'balance' && <TokenBalance />}
                {activeTab === 'dashboard' && <Dashboard />}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
