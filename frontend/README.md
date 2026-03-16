# 🪙 KavToken Frontend

A modern, beautiful web3 interface for interacting with the KavToken ERC1155 multi-token smart contract. Built with ReactJS, Wagmi, Viem, and RainbowKit.

## Features

✨ **Complete Smart Contract Integration**
- 🔄 Mint single and batch tokens
- 🔥 Burn single and batch tokens  
- ⏸️ Pause/Unpause individual tokens
- 💰 Check token balances
- 🎨 Beautiful UI with custom color palette
- 📱 Fully responsive design
- 🔐 Secure wallet connection
- ⚡ Real-time contract interactions

## Tech Stack

- **Frontend Framework**: React 18.2.0
- **Web3 Integration**: 
  - Wagmi 2.5.0 - React hooks for Web3
  - Viem 2.0.0 - TypeScript Ethereum client
  - RainbowKit 2.0.0 - Wallet connection UI
- **Styling**: Custom CSS with modern design patterns
- **Build Tool**: Create React App

## Prerequisites

- Node.js >= 16
- npm or yarn package manager
- A Web3 wallet (MetaMask, Rainbow, etc.)
- Sepolia or Mainnet testnet access

## Project ID Setup

This project uses RainbowKit which requires a WalletConnect Project ID for optimal functionality.

1. Get a free Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Update the `projectId` in `src/index.js` and `src/config/wagmi.js`:

```javascript
const config = getDefaultConfig({
  appName: 'KavToken',
  projectId: 'YOUR_PROJECT_ID_HERE',  // Replace this
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
```

## Installation

1. **Clone the repository**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file** (if needed)
```bash
# .env or .env.local
REACT_APP_CONTRACT_ADDRESS=0x701C0cB3e1147E8c4581B2741071e44406e7b90b
```

4. **Start development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## Usage

### 1. Connect Your Wallet
Click the "Connect" button in the top-right corner and select your Web3 wallet.

### 2. Mint Tokens
- Navigate to the **Mint Tokens** tab
- Choose between "Single Mint" or "Batch Mint"
- **Single Mint**:
  - Enter recipient address
  - Enter token ID
  - Enter amount
  - Click "Mint Token"
- **Batch Mint**:
  - Enter recipient address
  - Enter token IDs (comma-separated)
  - Enter amounts (comma-separated)
  - Click "Mint Batch Tokens"

### 3. Burn Tokens
- Navigate to the **Burn Tokens** tab
- Choose between "Single Burn" or "Batch Burn"
- **Single Burn**:
  - (Optional) Enter burn from address
  - Enter token ID
  - Enter amount to burn
  - Click "Burn Token"
- **Batch Burn**:
  - (Optional) Enter burn from address
  - Enter token IDs (comma-separated)
  - Enter amounts (comma-separated)
  - Click "Burn Batch Tokens"

### 4. Manage Token Pause Status
- Navigate to the **Manage Tokens** tab
- Enter the token ID to manage
- View current pause status
- Click "Pause Token" or "Unpause Token" as needed

### 5. Check Token Balance
- Navigate to the **Check Balance** tab
- Enter wallet address
- Enter token ID
- Click "Check Balance"
- View the current balance

## Contract Information

**Contract Address**: `0x701C0cB3e1147E8c4581B2741071e44406e7b90b`

**Supported Networks**:
- Mainnet
- Sepolia Testnet

**Main Functions**:
- `mint(address account, uint256 id, uint256 amount, bytes data)` - Mint tokens
- `mintBatch(address to, uint256[] ids, uint256[] amounts, bytes data)` - Mint multiple tokens
- `burn(address account, uint256 id, uint256 value)` - Burn tokens
- `burnBatch(address account, uint256[] ids, uint256[] values)` - Burn multiple tokens
- `pauseToken(uint256 id)` - Pause a specific token
- `unpauseToken(uint256 id)` - Unpause a specific token
- `balanceOf(address account, uint256 id)` - Check token balance
- `pauseAll()` - Emergency pause (owner only)
- `unpauseAll()` - Emergency unpause (owner only)

## Building for Production

```bash
npm run build
```

The optimized build will be created in the `build/` directory.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── WalletConnection.js
│   │   ├── MintToken.js
│   │   ├── BurnToken.js
│   │   ├── PauseToken.js
│   │   └── TokenBalance.js
│   ├── constants/
│   │   └── contract.js
│   ├── config/
│   │   └── wagmi.js
│   ├── styles/
│   │   ├── WalletConnection.css
│   │   ├── MintToken.css
│   │   ├── BurnToken.css
│   │   ├── PauseToken.css
│   │   └── TokenBalance.css
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## Color Scheme

The UI uses an elegant color palette:
- **Primary Blue**: `#4C8CE4` - Main interactive elements
- **Success Green**: `#91D06C` - Success states and confirmations
- **Accent Yellow**: `#FFF799` - Highlights and accents

## Features Breakdown

### 🎯 Full Functionality Support
- ✅ All ERC1155 functions implemented
- ✅ Role-based access control (Creator/Owner verification)
- ✅ Real-time balance checking
- ✅ Transaction status tracking
- ✅ Error handling and user feedback

### 🎨 Design Highlights
- Modern gradient backgrounds
- Smooth animations and transitions
- Glassmorphic card designs
- Responsive grid layouts
- Accessible component design

### 🔒 Security Features
- Wallet signature verification
- Contract interaction verification
- Input validation
- Error boundary handling

## Troubleshooting

### Issue: Contract not found
- Verify the contract address is correct
- Ensure you're on the correct network
- Check contract is deployed on that network

### Issue: Wallet won't connect
- Clear browser cache
- Check if MetaMask/wallet is unlocked
- Try a different wallet provider
- Ensure network is supported

### Issue: Transaction failed
- Check gas prices
- Verify sufficient balance
- Check token ID permissions
- Ensure you're the token creator for minting

### Issue: Balance not updating
- Refresh the page after transaction
- Wait for blockchain confirmation
- Check connected wallet address
- Verify token ID exists

## Support & Contribution

For issues or improvements, please create a GitHub issue or submit a pull request.

## License

MIT License

---

**Built with ❤️ for Web3**

For smart contract documentation, see the [smart contract directory](../smartcontract/README.md)
