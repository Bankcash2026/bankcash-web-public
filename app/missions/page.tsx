'use client';
import { useEffect, useState, useCallback } from 'react';
import { NavBar } from '@/components/NavBar';
import { PageShell, PageHeading, Card, RequireAuth, Spinner, num } from '@/components/ui';
import { api, ApiError } from '@/lib/api';

const CADENCE_LABEL: Record<string, string> = { DAILY: 'Daily', WEEKLY: 'Weekly', ONE_TIME: 'One-time' };

function MissionsInner() {
  const [missions, setMissions] = useState<any[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await api.missions();
      setMissions(r.missions || []);
    } catch (e) {
      setNote(e instanceof ApiError ? e.message : 'Failed to load missions');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function claim(key: string) {
    setBusy(key);
    setNote(null);
    try {
      const r = await api.claimMission(key);
      const parts = [
        r.points ? `+${num(r.points)} pts` : '',
        r.cashback ? `+${num(r.cashback)} cashback` : '',
        r.tickets ? `+${num(r.tickets)} tickets` : '',
      ].filter(Boolean);
      setNote(`Claimed!${parts.length ? ' ' + parts.join(' · ') : ''}`);
      await load();
    } catch (e) {
      setNote(e instanceof ApiError ? e.message : 'Claim failed');
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <PageHeading
        kicker="Missions"
        title="Earn while you degen"
        sub="Complete daily, weekly, and one-time missions for points, cashback, and spin tickets. On-chain actions are verified against your real activity."
      />
      {note && <p className="mb-4 font-mono text-sm text-neon">{note}</p>}
      {!missions && <Spinner label="Loading missions…" />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {missions?.map((m) => {
          const ready = m.completed && !m.claimed;
          return (
            <Card key={m.key} className={ready ? 'glass-neon' : ''}>
              <div className="flex items-center justify-between">
                <span className="chip !text-[10px]">{CADENCE_LABEL[m.cadence] ?? m.cadence}</span>
                <span className="font-mono text-xs text-white/40">
                  {m.claimed ? 'Claimed ✓' : m.completed ? 'Ready' : 'Locked'}
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-white">{m.title}</h3>
              <p className="mt-1 text-sm text-white/55">{m.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.reward.points > 0 && <span className="chip !text-[10px] !text-neon">+{num(m.reward.points)} pts</span>}
                {m.reward.cashback > 0 && <span className="chip !text-[10px] !text-gold">+{num(m.reward.cashback)} cb</span>}
                {m.reward.tickets > 0 && <span className="chip !text-[10px] !text-electric">+{num(m.reward.tickets)} 🎟</span>}
              </div>
              <button
                onClick={() => claim(m.key)}
                disabled={!ready || busy === m.key}
                className="btn-neon mt-5 w-full disabled:opacity-30"
              >
                {busy === m.key ? 'Claiming…' : m.claimed ? 'Claimed' : 'Claim reward'}
              </button>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export default function MissionsPage() {
  return (
    <>
      <NavBar />
      <PageShell>
        <RequireAuth>
          <MissionsInner />
        </RequireAuth>
      </PageShell>
    </>
  );
}
