import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { validateEnv } from './env';

// Validate environment variables
validateEnv();

// Create Wagmi config with connectors
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({ 
      projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'default'
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
