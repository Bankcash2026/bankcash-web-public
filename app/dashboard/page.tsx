'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/NavBar';
import { PageShell, PageHeading, StatCard, Card, RequireAuth, Spinner, num, shortAddr } from '@/components/ui';
import { api, ApiError } from '@/lib/api';

function DashboardInner() {
  const [me, setMe] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [m, ms] = await Promise.all([api.me(), api.missions().catch(() => ({ missions: [] }))]);
      setMe(m);
      setMissions(ms.missions || []);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Failed to load');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const claimDaily = async () => {
    setClaiming(true);
    try {
      const r = await api.claimDaily();
      setToast(`Claimed ${num(r.pointsEarned ?? 0)} points + 1 spin ticket!`);
      await load();
    } catch (e) {
      setToast(e instanceof ApiError ? e.message : 'Claim failed');
    } finally {
      setClaiming(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (err) return <p className="font-mono text-danger">{err}</p>;
  if (!me) return <Spinner label="Loading your bank…" />;

  const refLink =
    typeof window !== 'undefined' ? `${window.location.origin}/ref/${me.referralCode}` : `/ref/${me.referralCode}`;
  const claimedMissions = missions.filter((m) => m.claimed).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeading
          kicker={`Welcome back · ${shortAddr(me.walletAddress)}`}
          title={`${me.rankLabel}`}
          sub="Your futuristic meme bank. Every balance below is yours — we never custody funds."
        />
        <div className="chip !text-sm !text-gold">Degen score · {num(me.degenScore)}</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Points" value={num(me.totalPoints)} accent="neon" />
        <StatCard label="Cashback" value={num(me.cashbackBalance)} accent="gold" hint="off-chain rewards" />
        <StatCard label="Spin Tickets" value={num(me.spinTickets)} accent="electric" />
        <StatCard label="Day Streak" value={`${num(me.streak)} 🔥`} accent="white" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Daily reward */}
        <Card className="lg:col-span-1">
          <p className="section-label">Daily Reward</p>
          <p className="mt-2 text-white/60">
            {me.daily.canClaim
              ? 'Your daily drop is ready. Streaks boost your multiplier up to 3×.'
              : 'Already claimed. Come back tomorrow to keep your streak alive.'}
          </p>
          <button onClick={claimDaily} disabled={!me.daily.canClaim || claiming} className="btn-neon mt-5 w-full disabled:opacity-40">
            {claiming ? 'Claiming…' : me.daily.canClaim ? 'Claim daily reward' : 'Claimed today'}
          </button>
          {me.daily.nextClaimAt && !me.daily.canClaim && (
            <p className="mt-3 font-mono text-xs text-white/40">
              Next claim · {new Date(me.daily.nextClaimAt).toLocaleString()}
            </p>
          )}
        </Card>

        {/* Vault snapshot */}
        <Card>
          <p className="section-label">Vault Balance</p>
          <p className="stat-num mt-3 text-3xl font-bold text-neon">{num(BigInt(me.vaultBalance || '0').toString())}</p>
          <p className="mt-1 font-mono text-xs text-white/40">BANKCASH (display mirror of on-chain)</p>
          <Link href="/vault" className="btn-ghost mt-5 w-full">
            Manage vault
          </Link>
        </Card>

        {/* Referral */}
        <Card>
          <p className="section-label">Your Referral</p>
          <p className="mt-3 font-mono text-xs text-white/40">Invite friends · you get 5 cashback each</p>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <span className="truncate font-mono text-sm text-white/70">{refLink}</span>
            <button
              onClick={() => navigator.clipboard?.writeText(refLink)}
              className="shrink-0 rounded-md bg-neon/15 px-2 py-1 font-mono text-xs text-neon"
            >
              Copy
            </button>
          </div>
          <p className="mt-3 font-mono text-xs text-white/40">{num(me.referralCount)} friends invited</p>
        </Card>
      </div>

      {/* Missions progress */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">Mission progress</h2>
        <Link href="/missions" className="font-mono text-sm text-white/50 hover:text-neon">
          {claimedMissions}/{missions.length} done · view all →
        </Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {missions.slice(0, 4).map((m) => (
          <div key={m.key} className="glass p-4">
            <p className="font-display text-sm font-bold text-white">{m.title}</p>
            <p className="mt-1 font-mono text-xs text-white/45">
              {m.completed ? (m.claimed ? 'Claimed ✓' : 'Ready to claim') : 'In progress'}
            </p>
            <p className="mt-2 font-mono text-xs text-gold">+{num(m.reward?.points)} pts</p>
          </div>
        ))}
        {missions.length === 0 && <p className="font-mono text-sm text-white/40">No missions loaded.</p>}
      </div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-neon/30 bg-ink-800 px-5 py-3 font-mono text-sm text-neon shadow-neon-glow"
        >
          {toast}
        </motion.div>
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <>
      <NavBar />
      <PageShell>
        <RequireAuth>
          <DashboardInner />
        </RequireAuth>
      </PageShell>
    </>
  );
}
