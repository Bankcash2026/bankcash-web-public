'use client';
import { useEffect, useState, useCallback } from 'react';
import { NavBar } from '@/components/NavBar';
import { PageShell, PageHeading, StatCard, Card, RequireAuth, num } from '@/components/ui';
import { api, ApiError } from '@/lib/api';

function ReferralInner() {
  const [me, setMe] = useState<any>(null);
  const [code, setCode] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setMe(await api.me());
  }, []);

  useEffect(() => {
    void load();
    // auto-fill any code captured from a /ref/CODE link
    const pending = typeof window !== 'undefined' ? localStorage.getItem('bankcash-ref') : null;
    if (pending) setCode(pending);
  }, [load]);

  const link =
    typeof window !== 'undefined' && me ? `${window.location.origin}/ref/${me.referralCode}` : '';

  async function apply() {
    if (!code.trim()) return;
    setBusy(true);
    setNote(null);
    try {
      await api.applyReferral(code.trim().toUpperCase());
      localStorage.removeItem('bankcash-ref');
      setNote('Referral applied! You earned a spin ticket.');
      await load();
    } catch (e) {
      setNote(e instanceof ApiError ? e.message : 'Could not apply referral');
    } finally {
      setBusy(false);
    }
  }

  const shareText = encodeURIComponent(
    'I just opened an account at BankCash Rewards Bank — the first rewards bank for degens. Save, spin, earn cashback. Join me:',
  );

  return (
    <>
      <PageHeading
        kicker="Referrals"
        title="Recruit your fellow degens"
        sub="You earn 5 cashback for every friend who joins. They get a free spin ticket. Self-referral and duplicates are blocked."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Friends Invited" value={num(me?.referralCount ?? 0)} accent="neon" />
        <StatCard label="Cashback Earned" value={num((me?.referralCount ?? 0) * 5)} accent="gold" hint="5 per friend" />
        <StatCard label="Your Code" value={me?.referralCode ?? '—'} accent="electric" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="glass-neon">
          <p className="section-label">Your referral link</p>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <span className="truncate font-mono text-sm text-white/70">{link || '…'}</span>
            <button
              onClick={() => navigator.clipboard?.writeText(link)}
              className="shrink-0 rounded-md bg-neon/15 px-3 py-1 font-mono text-xs text-neon"
            >
              Copy
            </button>
          </div>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(link)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-neon mt-4 w-full"
          >
            Share on X
          </a>
        </Card>

        <Card>
          <p className="section-label">Got invited?</p>
          <p className="mt-2 text-sm text-white/55">Enter a friend&apos;s code to claim your bonus spin ticket.</p>
          <div className="mt-4 flex gap-3">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="DEGEN123"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-white outline-none focus:border-neon/40"
            />
            <button onClick={apply} disabled={busy} className="btn-ghost disabled:opacity-40">
              {busy ? '…' : 'Apply'}
            </button>
          </div>
          {note && <p className="mt-3 font-mono text-xs text-white/60">{note}</p>}
          {me?.referredBy && (
            <p className="mt-3 font-mono text-xs text-white/35">You were referred by {me.referredBy}.</p>
          )}
        </Card>
      </div>
    </>
  );
}

export default function ReferralPage() {
  return (
    <>
      <NavBar />
      <PageShell>
        <RequireAuth>
          <ReferralInner />
        </RequireAuth>
      </PageShell>
    </>
  );
}
