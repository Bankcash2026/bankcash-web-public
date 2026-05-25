'use client';
import { useEffect, useState, useCallback } from 'react';
import { NavBar } from '@/components/NavBar';
import { PageShell, PageHeading, Card, Spinner, num } from '@/components/ui';
import { api } from '@/lib/api';

const BOARDS = [
  { key: 'points', label: 'Points' },
  { key: 'cashback', label: 'Cashback' },
  { key: 'vault', label: 'Vault' },
  { key: 'streak', label: 'Streak' },
  { key: 'referrals', label: 'Referrals' },
];

const RANK_LABELS: Record<string, string> = {
  BROKE_VISITOR: 'Broke Visitor',
  CASH_FARMER: 'Cash Farmer',
  DEGEN_SAVER: 'Degen Saver',
  VAULT_RAIDER: 'Vault Raider',
  GOLD_BANKSTER: 'Gold Bankster',
  DIAMOND_WHALE: 'Diamond Whale',
  FEDERAL_GOBLIN: 'Federal Goblin',
};

function fmtValue(board: string, value: any) {
  if (board === 'vault') {
    try {
      return num((BigInt(value || '0') / 10n ** 18n).toString());
    } catch {
      return num(value);
    }
  }
  return num(value);
}

export default function LeaderboardPage() {
  const [board, setBoard] = useState('points');
  const [rows, setRows] = useState<any[] | null>(null);

  const load = useCallback(async (b: string) => {
    setRows(null);
    try {
      const r = await api.leaderboard(b);
      setRows(r.rows || []);
    } catch {
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load(board);
  }, [board, load]);

  return (
    <>
      <NavBar />
      <PageShell>
        <PageHeading
          kicker="Leaderboard"
          title="The degen rich list"
          sub="No login required to spectate. Switch boards to see who's farming, saving, spinning, and inviting their way to Federal Goblin status."
        />

        <div className="mb-6 flex flex-wrap gap-2">
          {BOARDS.map((b) => (
            <button
              key={b.key}
              onClick={() => setBoard(b.key)}
              className={`rounded-lg border px-4 py-2 font-mono text-sm transition-colors ${
                board === b.key ? 'border-neon/50 bg-neon/10 text-neon' : 'border-white/10 text-white/55 hover:text-white'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        <Card className="!p-0">
          {!rows && <div className="p-6"><Spinner label="Loading board…" /></div>}
          {rows && rows.length === 0 && <p className="p-6 font-mono text-sm text-white/40">No entries yet. Be the first.</p>}
          {rows && rows.length > 0 && (
            <div className="divide-y divide-white/6">
              {rows.map((r) => (
                <div key={r.rank} className="flex items-center gap-4 px-5 py-3">
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-mono text-sm font-bold ${
                      r.rank === 1
                        ? 'bg-gold/20 text-gold'
                        : r.rank <= 3
                          ? 'bg-neon/15 text-neon'
                          : 'bg-white/5 text-white/50'
                    }`}
                  >
                    {r.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-sm text-white/85">{r.username || r.wallet}</p>
                    <p className="font-mono text-xs text-white/35">{RANK_LABELS[r.userRank] ?? r.userRank ?? ''}</p>
                  </div>
                  <span className="stat-num text-lg font-bold text-white">{fmtValue(board, r.value)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </PageShell>
    </>
  );
}
