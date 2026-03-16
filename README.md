# 🪙 MultiToken Creation - KavToken Hub

A comprehensive decentralized application for creating, managing, and interacting with ERC1155 multi-tokens on the Ethereum blockchain. Built with React 18, Wagmi 2.x, Viem 2.x, and Solidity.

## 🌟 Project Overview

**MultiToken Creation** is a full-stack Web3 application that enables users to manage complex token operations through an intuitive interface. The project combines a modern React frontend with a robust ERC1155 smart contract backend.

### ✨ Core Features

- 🔄 **Mint Tokens**: Create new tokens or increase supply (single and batch)
- 🔥 **Burn Tokens**: Permanently destroy tokens (single and batch)
- ⏸️ **Pause/Unpause**: Pause specific tokens to prevent minting
- 💰 **Check Balance**: Real-time token balance queries
- 👥 **Transfer Tokens**: Send tokens to other addresses
- 📊 **Dashboard**: Comprehensive overview of all operations
- 🎨 **Beautiful UI**: Modern design with responsive layout
- 🔐 **Secure**: Wallet connection with access control
- ⚡ **Real-time**: Live contract interactions and updates

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI Framework |
| Wagmi | 2.5.0 | React hooks for Web3 |
| Viem | 2.0.0 | TypeScript Ethereum client |
| React Query | 5.0.0 | Data fetching & caching |
| Axios | 1.6.0 | HTTP requests |
| React Scripts | 5.0.1 | Build tooling |

### Smart Contracts
| Technology | Version | Purpose |
|-----------|---------|---------|
| Solidity | ^0.8.27 | Smart contract language |
| OpenZeppelin | ^5.0 | Token standards & utilities |
| ERC1155 | Standard | Multi-token implementation |

## 📋 Prerequisites

- **Node.js** >= 14
- **npm** or **yarn** package manager
- **Web3 Wallet** (MetaMask, Rainbow, WalletConnect, etc.)
- **Testnet access** (Sepolia recommended) or Mainnet

## 🚀 Quick Start

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd MultiToken_Creation/frontend
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Environment Configuration
```bash
cp .env.example .env.local
```

### 4. Update `.env.local`
```env
REACT_APP_WALLETCONNECT_PROJECT_ID=your_wallet_connect_project_id
REACT_APP_CONTRACT_ADDRESS=0x... # Your deployed contract address
REACT_APP_APP_NAME=KavToken Hub
```

Get a free WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

### 5. Verify Environment
```bash
npm run env-check
```

### 6. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`


## 📚 Usage Guide

### 1️⃣ Connect Your Wallet
- Click the **"Connect Wallet"** button in the top-right corner
- Select your Web3 wallet (MetaMask, Rainbow, etc.)
- Approve the connection request
- Your wallet address will be displayed in the header

### 2️⃣ Mint Tokens
Navigate to the **"🔄 Mint Tokens"** tab:

**Single Mint**:
- Enter recipient wallet address
- Enter token ID
- Enter amount to mint
- Click "Mint Token"
- Confirm transaction in your wallet

**Batch Mint**:
- Enter recipient address
- Enter token IDs (comma-separated)
- Enter amounts (comma-separated, must match IDs length)
- Click "Mint Batch Tokens"
- Confirm transaction

### 3️⃣ Burn Tokens
Navigate to the **"🔥 Burn Tokens"** tab:

**Single Burn**:
- Enter token ID to burn
- Enter amount to burn
- Click "Burn Token"
- Confirm in wallet

**Batch Burn**:
- Enter token IDs (comma-separated)
- Enter amounts (comma-separated)
- Click "Burn Batch Tokens"
- Confirm transaction

### 4️⃣ Manage Token Pause Status
Navigate to the **"⏸️ Manage Tokens"** tab:

- Enter token ID
- View current pause status
- Click "Pause Token" to prevent minting
- Click "Unpause Token" to resume minting
- Only token creator or owner can manage

### 5️⃣ Check Token Balance
Navigate to the **"💰 Check Balance"** tab:

- Enter wallet address
- Enter token ID
- View current balance
- Updates in real-time

### 6️⃣ View Dashboard
Navigate to the **"📊 Dashboard"** tab:

- Overview of all token operations
- Transaction history
- Token statistics
- Total created tokens

### 7️⃣ Transfer Tokens
Navigate to the **"Transfer Token"** section:

- Enter recipient address
- Enter token ID
- Enter transfer amount
- Click "Transfer"
- Confirm transaction

## 📁 Project Structure

```
MultiToken_Creation/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── MintToken.js          # Token minting functionality
│   │   │   ├── BurnToken.js          # Token burning functionality
│   │   │   ├── PauseToken.js         # Pause management
│   │   │   ├── TransferToken.js      # Token transfers
│   │   │   ├── TokenBalance.js       # Balance viewing
│   │   │   ├── WalletConnection.js   # Wallet UI
│   │   │   └── Dashboard.js          # Overview dashboard
│   │   ├── config/
│   │   │   ├── env.js               # Environment loader
│   │   │   └── wagmi.js             # Wagmi configuration
│   │   ├── constants/
│   │   │   └── contract.js          # ABI & addresses
│   │   ├── utils/
│   │   │   ├── contractUtils.js     # Contract helpers
│   │   │   ├── errorHandler.js      # Error handling
│   │   │   ├── tokenMetadata.js     # Token metadata
│   │   │   └── transactionHelpers.js # Transaction utils
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── Dashboard.css
│   │   │   ├── MintToken.css
│   │   │   ├── BurnToken.css
│   │   │   ├── PauseToken.css
│   │   │   ├── TokenBalance.css
│   │   │   └── WalletConnection.css
│   │   ├── App.js                  # Main App component
│   │   ├── index.js                # React entry point
│   ├── scripts/
│   │   ├── env-check.js           # Validate environment
│   │   └── setup-env.js           # Setup environment
│   ├── package.json
│   ├── craco.config.js            # Webpack override
│   ├── .env.example               # Environment template
│   └── README.md
│
└── smartcontract/
    └── multiToken.sol              # ERC1155 Smart Contract
```

## 💻 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Start development server (port 3000) |
| `npm build` | Build production bundle |
| `npm test` | Run test suite |
| `npm run env-check` | Validate environment variables |
| `npm run setup-env` | Initialize environment setup |
| `npm run eject` | Eject from Create React App (⚠️ irreversible) |

## 🔐 Smart Contract Details

### Contract: KavToken (ERC1155)

The smart contract implements the ERC1155 multi-token standard with extended functionality.

#### Key Features

1. **Token Creator Model**
   - Each token has a creator/owner
   - Only creators can mint their tokens
   - Prevents unauthorized minting

2. **Pause Mechanism**
   - Pause individual tokens
   - Emergency pause-all for owner
   - Token-specific pause state

3. **Burn Functionality**
   - Token holders can burn their tokens
   - Owner can burn any tokens
   - Batch burning supported

4. **Access Control**
   - Owner-based permissions
   - Creator-based permissions
   - Role verification on all critical functions

#### Core Functions

```solidity
// Minting
mint(address account, uint256 id, uint256 amount, bytes data)
  → Mint tokens for specific ID

mintBatch(address to, uint256[] ids, uint256[] amounts, bytes data)
  → Mint multiple tokens in one transaction

// Burning
burn(address account, uint256 id, uint256 value)
  → Burn specific tokens

burnBatch(address account, uint256[] ids, uint256[] values)
  → Burn multiple tokens

// Pause Management
pauseToken(uint256 id)
  → Pause specific token (creator/owner only)

unpauseToken(uint256 id)
  → Unpause specific token (creator/owner only)

pauseAll()
  → Emergency pause all (owner only)

unpauseAll()
  → Emergency unpause all (owner only)

// View Functions
balanceOf(address account, uint256 id) → uint256
  → Get token balance for address

balanceOfBatch(address[] accounts, uint256[] ids) → uint256[]
  → Get multiple balances

tokencreator(uint256 id) → address
  → Get token creator

pausedTokens(uint256 id) → bool
  → Check if token is paused
```

#### Supported Networks

The contract can be deployed to:
- Ethereum Mainnet
- Sepolia Testnet
- Polygon
- Other EVM-compatible chains

## 🔧 Configuration

### Environment Variables

Create `.env.local` with:

```env
# WalletConnect Project ID (required)
REACT_APP_WALLETCONNECT_PROJECT_ID=abc123...

# Contract Address (required)
REACT_APP_CONTRACT_ADDRESS=0x123...

# App Display Name (optional)
REACT_APP_APP_NAME=KavToken Hub
```

### Wagmi Configuration

Edit `src/config/wagmi.js` to:
- Add/remove supported chains
- Update RPC endpoints
- Configure wallet connectors
- Set gas settings

### Contract Configuration

Update `src/constants/contract.js` with:
- Contract ABI
- Contract address
- Network-specific addresses

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#4C8CE4` - Main buttons and links
- **Success Green**: `#91D06C` - Success states
- **Accent Yellow**: `#FFF799` - Highlights
- **Dark Background**: `#1a1a2e` - Dark mode
- **Card Background**: `#16213e` - Card containers


### Issue: Wallet Connection Failed
- **Check**: WalletConnect Project ID is valid
- **Check**: Wallet browser extension is enabled
- **Check**: You're on a supported network
- **Solution**: Clear browser cache and reconnect

### Issue: Contract Interaction Errors
- **Check**: Contract address is correct in `.env.local`
- **Check**: You're connected to the correct network
- **Check**: Have sufficient gas for transaction
- **Check**: Contract functions haven't been revoked

### Issue: Source Map Warnings
The project uses `craco` to suppress unnecessary source map warnings from node_modules. These warnings don't affect functionality.

### Issue: Dependency Conflicts
```bash
# Use legacy peer dependency resolution
npm install --legacy-peer-deps
```

### Issue: Transaction Failed
- Check gas prices
- Verify sufficient balance
- Check token ID permissions
- Ensure you're the token creator for minting

### Issue: Balance Not Updating
- Refresh the page after transaction
- Wait for blockchain confirmation
- Check connected wallet address
- Verify token ID exists

## 🔍 Debugging

### Enable Verbose Logging
```bash
// In src/config/env.js
const DEBUG = true;
```

### Browser DevTools
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for application errors and warnings
4. Check **Network** tab for RPC calls

### WalletConnect Debugging
View connected sessions in [WalletConnect Cloud Dashboard](https://cloud.walletconnect.com/)

## 📊 Performance Optimization

- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Automatic with React.lazy()
- **Query Caching**: React Query caches contract data
- **Gas Optimization**: Batch operations reduce gas costs
- **Responsive Images**: Optimized for all screen sizes

## 🔐 Security Considerations

### Frontend Security
- ✅ No private keys stored
- ✅ All transactions are user-approved
- ✅ Contract interactions use safe ABI
- ✅ Input validation on all forms

### Smart Contract Security
- ✅ OpenZeppelin audited contracts
- ✅ Access control implemented
- ✅ Pause mechanism for emergencies
- ✅ No reentrancy vulnerabilities

### User Best Practices
1. Always verify contract address before use
2. Check transaction details in wallet
3. Use testnet first (Sepolia)
4. Never share private keys
5. Use hardware wallets for mainnet

## 📚 Documentation Links

| Resource | URL |
|----------|-----|
| Wagmi Docs | https://wagmi.sh/ |
| Viem Docs | https://viem.sh/ |
| React Docs | https://react.dev/ |
| ERC1155 Standard | https://eips.ethereum.org/EIPS/eip-1155 |
| OpenZeppelin Contracts | https://docs.openzeppelin.com/contracts/ |
| Solidity Docs | https://docs.soliditylang.org/ |
| WalletConnect | https://docs.walletconnect.com/ |

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

## 📝 Code Style

### JavaScript/React
- Use functional components
- Use React hooks
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions

### CSS
- Use component-scoped CSS files
- Follow BEM naming convention
- Use CSS variables for colors
- Mobile-first responsive design

### Solidity
- Follow Solidity style guide
- Use natspec documentation
- Include zero-address checks
- Implement access control

## 🐛 Known Issues

None currently. Please report issues on GitHub.

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## Acknowledgments

- **OpenZeppelin** - For battle-tested contracts
- **Wagmi** - For excellent Web3 React hooks
- **Viem** - For type-safe Ethereum client
- **React Query** - For data fetching solutions
- **Create React App** - For project scaffolding

## 📧 Support & Contact

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: [project contact]

## 🔄 Version History

### v0.1.0 (March 2026)
- ✨ Initial release
- 🔄 Mint functionality
- 🔥 Burn functionality
- ⏸️ Pause management
- 💰 Balance checking
- 🎨 Beautiful UI
 

For more information, visit the [GitHub Repository](repository-url)
