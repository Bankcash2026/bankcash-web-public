'use client';
import { useAuth } from './store';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuth.getState().token;
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error || 'Request failed', data.code);
  return data as T;
}

export const api = {
  // auth
  nonce: (walletAddress: string) =>
    request<{ nonce: string; message: string }>('/auth/nonce', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    }),
  verify: (body: { walletAddress: string; signature: string; referralCode?: string }) =>
    request<{ token: string; user: any }>('/auth/verify', { method: 'POST', body: JSON.stringify(body) }),

  // user / dashboard
  me: () => request<any>('/user/me'),

  // rewards
  claimDaily: () => request<any>('/daily/claim', { method: 'POST' }),
  spin: () => request<any>('/spin', { method: 'POST' }),
  spinHistory: () => request<{ spins: any[] }>('/spin/history'),

  // missions
  missions: () => request<{ missions: any[] }>('/missions'),
  claimMission: (missionKey: string) =>
    request<any>('/missions/claim', { method: 'POST', body: JSON.stringify({ missionKey }) }),

  // social / growth
  leaderboard: (board = 'points') => request<{ board: string; rows: any[] }>(`/leaderboard?board=${board}`),
  applyReferral: (referralCode: string) =>
    request<any>('/referral/apply', { method: 'POST', body: JSON.stringify({ referralCode }) }),

  // vault
  vault: () => request<{ vaultBalance: string; txs: any[] }>('/vault/user'),
  logDeposit: (amount: string, txHash: string) =>
    request<any>('/vault/deposit-log', { method: 'POST', body: JSON.stringify({ amount, txHash }) }),
  logWithdraw: (amount: string, txHash: string) =>
    request<any>('/vault/withdraw-log', { method: 'POST', body: JSON.stringify({ amount, txHash }) }),

  // lucky vault
  luckyCurrent: () => request<any>('/lucky/current'),
  luckyEnter: (method: 'TICKETS' | 'POINTS', amount: number) =>
    request<any>('/lucky/enter', { method: 'POST', body: JSON.stringify({ method, amount }) }),

  // admin
  adminUsers: (limit = 100) => request<{ total: number; users: any[] }>(`/admin/users?limit=${limit}`),
  adminSpins: (limit = 100) => request<{ spins: any[] }>(`/admin/spins?limit=${limit}`),
  adminBan: (walletAddress: string, banned: boolean) =>
    request<any>('/admin/ban', { method: 'POST', body: JSON.stringify({ walletAddress, banned }) }),
  adminDrawLuckyVault: () => request<any>('/admin/lucky-vault/draw', { method: 'POST' }),
  adminExportUsersUrl: () => `${BASE}/admin/export/users.csv`,
};

export { ApiError };
