'use client';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';
import { http } from 'wagmi';

// RainbowKit + wagmi v2 config. WalletConnect projectId comes from env.
export const wagmiConfig = getDefaultConfig({
  appName: 'BankCash Rewards Bank',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'DEMO_PROJECT_ID',
  chains: [base],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
  },
  ssr: true,
});
