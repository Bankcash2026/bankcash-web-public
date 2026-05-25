'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { PageShell, PageHeading, StatCard, Card, RequireAuth, Spinner, num, shortAddr } from '@/components/ui';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/store';

function AdminInner() {
  const token = useAuth((s) => s.token);
  const [me, setMe] = useState<any>(null);
  const [tab, setTab] = useState<'users' | 'spins'>('users');
  const [users, setUsers] = useState<any>(null);
  const [spins, setSpins] = useState<any[] | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);

  const load = useCallback(async () => {
    try {
      setMe(await api.me());
      const [u, s] = await Promise.all([api.adminUsers(200), api.adminSpins(100)]);
      setUsers(u);
      setSpins(s.spins);
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) setDenied(true);
      else setNote(e instanceof ApiError ? e.message : 'Failed to load admin data');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function ban(wallet: string, banned: boolean) {
    try {
      await api.adminBan(wallet, banned);
      await load();
    } catch (e) {
      setNote(e instanceof ApiError ? e.message : 'Ban failed');
    }
  }

  async function draw() {
    if (!confirm('Draw the Lucky Vault winner and open a new round?')) return;
    try {
      const r = await api.adminDrawLuckyVault();
      setNote(r.winnerWallet ? `Winner: ${shortAddr(r.winnerWallet)} 🎉` : 'Draw complete.');
      await load();
    } catch (e) {
      setNote(e instanceof ApiError ? e.message : 'Draw failed');
    }
  }

  async function exportCsv() {
    const res = await fetch(api.adminExportUsersUrl(), { headers: { Authorization: `Bearer ${token}` } });
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bankcash-users.csv';
    a.click();
  }

  if (denied) {
    return (
      <Card className="mx-auto mt-10 max-w-md text-center">
        <h2 className="font-display text-xl font-bold text-danger">Access denied</h2>
        <p className="mt-2 text-white/55">This wallet is not on the admin allowlist.</p>
        <Link href="/dashboard" className="btn-ghost mt-5">
          Back to dashboard
        </Link>
      </Card>
    );
  }

  if (!users) return <Spinner label="Loading admin console…" />;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeading kicker="Admin Console" title="Bank Manager" sub="Protected route — admin wallets only." />
        <div className="flex gap-3">
          <button onClick={exportCsv} className="btn-ghost !py-2">
            Export users CSV
          </button>
          <button onClick={draw} className="btn-neon !py-2">
            Draw Lucky Vault
          </button>
        </div>
      </div>

      {note && <p className="mb-4 font-mono text-sm text-neon">{note}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value={num(users.total)} accent="neon" />
        <StatCard label="Spins (recent)" value={num(spins?.length ?? 0)} accent="electric" />
        <StatCard label="You" value={shortAddr(me?.walletAddress)} accent="gold" />
      </div>

      <div className="mt-6 flex gap-2">
        {(['users', 'spins'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg border px-4 py-2 font-mono text-sm capitalize transition-colors ${
              tab === t ? 'border-neon/50 bg-neon/10 text-neon' : 'border-white/10 text-white/55'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <Card className="mt-4 !p-0">
        {tab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/8 font-mono text-xs uppercase text-white/40">
                <tr>
                  <th className="px-4 py-3">Wallet</th>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Points</th>
                  <th className="px-4 py-3">Cashback</th>
                  <th className="px-4 py-3">Streak</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6 font-mono">
                {users.users.map((u: any) => (
                  <tr key={u.id} className="text-white/75">
                    <td className="px-4 py-3">{shortAddr(u.walletAddress)}</td>
                    <td className="px-4 py-3 text-white/50">{u.rank}</td>
                    <td className="px-4 py-3 text-neon">{num(u.totalPoints)}</td>
                    <td className="px-4 py-3 text-gold">{num(u.cashbackBalance)}</td>
                    <td className="px-4 py-3">{num(u.streak)}</td>
                    <td className="px-4 py-3">
                      {u.isBanned ? <span className="text-danger">banned</span> : <span className="text-white/40">active</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => ban(u.walletAddress, !u.isBanned)}
                        className={`rounded-md px-3 py-1 text-xs ${u.isBanned ? 'bg-neon/15 text-neon' : 'bg-danger/15 text-danger'}`}
                      >
                        {u.isBanned ? 'Unban' : 'Ban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'spins' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/8 font-mono text-xs uppercase text-white/40">
                <tr>
                  <th className="px-4 py-3">Wallet</th>
                  <th className="px-4 py-3">Reward</th>
                  <th className="px-4 py-3">Points</th>
                  <th className="px-4 py-3">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6 font-mono">
                {spins?.map((s) => (
                  <tr key={s.id} className="text-white/75">
                    <td className="px-4 py-3">{shortAddr(s.user?.walletAddress)}</td>
                    <td className="px-4 py-3 text-white/60">{s.reward}</td>
                    <td className="px-4 py-3 text-neon">{num(s.pointsAwarded)}</td>
                    <td className="px-4 py-3 text-white/40">{new Date(s.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

export default function AdminPage() {
  return (
    <>
      <NavBar />
      <PageShell>
        <RequireAuth>
          <AdminInner />
        </RequireAuth>
      </PageShell>
    </>
  );
}
