'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/NavBar';
import { PageShell, PageHeading, StatCard, Card, RequireAuth, num } from '@/components/ui';
import { api, ApiError } from '@/lib/api';

// Must mirror backend WHEEL order (services/spin.ts). Frontend only animates to wheelIndex.
const SEGMENTS = [
  { label: '50 Points', color: '#0052FF' },
  { label: '100 Points', color: '#60A5FA' },
  { label: '1 Cashback', color: '#2563FF' },
  { label: '2 Tickets', color: '#0052FF' },
  { label: '250 Points', color: '#60A5FA' },
  { label: 'Bankruptcy', color: '#FF5C7A' },
  { label: '5 Cashback', color: '#2563FF' },
  { label: '500 Points', color: '#0052FF' },
  { label: 'Jackpot', color: '#2563FF' },
  { label: 'Rug Badge', color: '#60A5FA' },
];

const N = SEGMENTS.length;
const SEG_ANGLE = 360 / N;

function Wheel({ rotation }: { rotation: number }) {
  const R = 160;
  const C = 180;
  return (
    <div className="relative grid place-items-center">
      {/* pointer */}
      <div className="absolute -top-1 z-20 h-0 w-0 border-x-[14px] border-t-[26px] border-x-transparent border-t-gold drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />
      <motion.svg
        width={360}
        height={360}
        viewBox="0 0 360 360"
        animate={{ rotate: rotation }}
        transition={{ duration: 4.4, ease: [0.12, 0.7, 0.1, 1] }}
        className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
      >
        {SEGMENTS.map((s, i) => {
          const a0 = (i * SEG_ANGLE - 90) * (Math.PI / 180);
          const a1 = ((i + 1) * SEG_ANGLE - 90) * (Math.PI / 180);
          const x0 = C + R * Math.cos(a0);
          const y0 = C + R * Math.sin(a0);
          const x1 = C + R * Math.cos(a1);
          const y1 = C + R * Math.sin(a1);
          const mid = (i * SEG_ANGLE + SEG_ANGLE / 2 - 90) * (Math.PI / 180);
          const tx = C + R * 0.62 * Math.cos(mid);
          const ty = C + R * 0.62 * Math.sin(mid);
          return (
            <g key={i}>
              <path
                d={`M${C},${C} L${x0},${y0} A${R},${R} 0 0,1 ${x1},${y1} Z`}
                fill={s.color}
                fillOpacity={0.16}
                stroke={s.color}
                strokeOpacity={0.6}
                strokeWidth={1}
              />
              <text
                x={tx}
                y={ty}
                fill="#e8eef5"
                fontSize="11"
                fontFamily="var(--font-mono)"
                textAnchor="middle"
                transform={`rotate(${i * SEG_ANGLE + SEG_ANGLE / 2}, ${tx}, ${ty})`}
              >
                {s.label}
              </text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={R} fill="none" stroke="#0052FF" strokeOpacity={0.4} strokeWidth={2} />
        <circle cx={C} cy={C} r={28} fill="#0A1428" stroke="#60A5FA" strokeOpacity={0.7} strokeWidth={2} />
        <text x={C} y={C + 5} fill="#60A5FA" fontSize="18" textAnchor="middle" fontFamily="var(--font-mono)">
          $
        </text>
      </motion.svg>
    </div>
  );
}

function SpinInner() {
  const [me, setMe] = useState<any>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [lucky, setLucky] = useState<any>(null);
  const turns = useRef(0);

  const load = useCallback(async () => {
    const [m, l] = await Promise.all([api.me(), api.luckyCurrent().catch(() => null)]);
    setMe(m);
    setLucky(l);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function spin() {
    if (spinning || !me || me.spinTickets < 1) return;
    setSpinning(true);
    setResult(null);
    try {
      const r = await api.spin();
      // land the pointer (top, 0deg) on the middle of segment r.wheelIndex
      turns.current += 5;
      const target = turns.current * 360 - (r.wheelIndex * SEG_ANGLE + SEG_ANGLE / 2);
      setRotation(target);
      setTimeout(async () => {
        const parts = [
          r.points ? `+${num(r.points)} points` : '',
          r.cashback ? `+${num(r.cashback)} cashback` : '',
          r.tickets ? `+${num(r.tickets)} tickets` : '',
          r.jackpotEntry ? 'Jackpot entry!' : '',
        ].filter(Boolean);
        setResult(`${r.label}${parts.length ? ' · ' + parts.join(' · ') : ''}`);
        setSpinning(false);
        await load();
      }, 4500);
    } catch (e) {
      setResult(e instanceof ApiError ? e.message : 'Spin failed');
      setSpinning(false);
    }
  }

  async function enterLucky(method: 'POINTS' | 'TICKETS', amount: number) {
    try {
      await api.luckyEnter(method, amount);
      await load();
    } catch (e) {
      setResult(e instanceof ApiError ? e.message : 'Entry failed');
    }
  }

  return (
    <>
      <PageHeading
        kicker="Lucky Spin"
        title="Fortune Wheel"
        sub="Burn a spin ticket and let the bank decide your fate. The result is determined server-side — the wheel just shows you the damage."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col items-center">
          <Wheel rotation={rotation} />
          <button onClick={spin} disabled={spinning || !me || me.spinTickets < 1} className="btn-neon mt-8 w-48 disabled:opacity-40">
            {spinning ? 'Spinning…' : me && me.spinTickets < 1 ? 'No tickets' : 'Spin (1 ticket)'}
          </button>
          {result && (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-center font-display text-lg font-bold text-gold">
              {result}
            </motion.p>
          )}
        </Card>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Spin Tickets" value={num(me?.spinTickets ?? 0)} accent="electric" />
            <StatCard label="Total Points" value={num(me?.totalPoints ?? 0)} accent="neon" />
          </div>

          <Card className="glass-gold">
            <p className="section-label !text-gold/80">Lucky Vault</p>
            <h3 className="mt-2 font-display text-xl font-bold text-white">The communal jackpot</h3>
            <p className="mt-2 text-sm text-white/55">
              Add entries with points or tickets. More entries, better odds. When the bank manager pulls the lever, one
              degen takes the pot.
            </p>
            {lucky && (
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="stat-num text-xl font-bold text-gold">{num(lucky.myTickets)}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Your entries</p>
                </div>
                <div>
                  <p className="stat-num text-xl font-bold text-white">{num(lucky.totalTickets)}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Pot entries</p>
                </div>
                <div>
                  <p className="stat-num text-xl font-bold text-electric">{num(lucky.players)}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Players</p>
                </div>
              </div>
            )}
            <div className="mt-5 flex gap-3">
              <button onClick={() => enterLucky('TICKETS', 1)} className="btn-ghost flex-1">
                Enter · 1 ticket
              </button>
              <button onClick={() => enterLucky('POINTS', lucky?.pointsPerEntry ?? 200)} className="btn-ghost flex-1">
                Enter · {num(lucky?.pointsPerEntry ?? 200)} pts
              </button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function SpinPage() {
  return (
    <>
      <NavBar />
      <PageShell>
        <RequireAuth>
          <SpinInner />
        </RequireAuth>
      </PageShell>
    </>
  );
}
