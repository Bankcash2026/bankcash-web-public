'use client';
import { useState, useCallback } from 'react';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { api } from './api';
import { useAuth } from './store';

/**
 * Drives the wallet-signature login:
 *  1. ask backend for a nonce/message
 *  2. user signs it with their wallet (personal_sign)
 *  3. backend verifies + returns a JWT we persist
 * The optional referralCode is applied on first login.
 */
export function useLogin() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const setToken = useAuth((s) => s.setToken);
  const logout = useAuth((s) => s.logout);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (referralCode?: string) => {
      if (!address) return null;
      setLoading(true);
      setError(null);
      try {
        const { message } = await api.nonce(address);
        const signature = await signMessageAsync({ message });
        const { token } = await api.verify({ walletAddress: address, signature, referralCode });
        setToken(token);
        return token;
      } catch (e: any) {
        setError(e?.message ?? 'Login failed');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [address, signMessageAsync, setToken],
  );

  const fullLogout = useCallback(() => {
    logout();
    disconnect();
  }, [logout, disconnect]);

  return { login, logout: fullLogout, loading, error, isConnected, address };
}
