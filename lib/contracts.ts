import tokenAbi from './abi/BankcashToken.json';
import vaultAbi from './abi/BankcashVault.json';

export const TOKEN_ABI = tokenAbi;
export const VAULT_ABI = vaultAbi;

export const CONTRACTS = {
  token: (process.env.NEXT_PUBLIC_BANKCASH_TOKEN_ADDRESS || '') as `0x${string}`,
  vault: (process.env.NEXT_PUBLIC_BANKCASH_VAULT_ADDRESS || '') as `0x${string}`,
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 8453),
};

export const isContractsConfigured = () => Boolean(CONTRACTS.token && CONTRACTS.vault);
