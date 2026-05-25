'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { NavBar } from '@/components/NavBar';
import { PageShell, PageHeading, Card, RequireAuth, Spinner, num, shortAddr } from '@/components/ui';
import { api } from '@/lib/api';

function CardInner() {
  const [me, setMe] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => setMe(await api.me()), []);
  useEffect(() => {
    void load();
  }, [load]);

  async function download() {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement('a');
      a.download = 'bankcash-card.png';
      a.href = dataUrl;
      a.click();
    } finally {
      setBusy(false);
    }
  }

  const shareText = encodeURIComponent(
    `My BankCash card is ${me ? me.rankLabel : 'loading'} status with ${me ? num(me.totalPoints) : 0} points. Save. Spin. Earn like a degen. @bankcash`,
  );

  if (!me) return <Spinner label="Minting your card…" />;

  return (
    <>
      <PageHeading
        kicker="Shareable Card"
        title="Your BankCash Card"
        sub="A premium degen debit card you can flex on the timeline. Download it as an image or share straight to X."
      />

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div className="flex justify-center">
          {/* The card — captured by html-to-image */}
          <div
            ref={cardRef}
            className="relative aspect-[1.586/1] w-full max-w-md overflow-hidden rounded-2xl p-6"
            style={{
              background:
                'radial-gradient(120% 120% at 0% 0%, #0f1e3d 0%, #04080f 55%), linear-gradient(135deg, rgba(0,82,255,0.18), rgba(96,165,250,0.08))',
              border: '1px solid rgba(0,82,255,0.4)',
              boxShadow: '0 30px 80px -20px rgba(0,82,255,0.45)',
            }}
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neon/20 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon/80">BankCash Rewards Bank</p>
                  <p className="mt-1 font-display text-xl font-extrabold text-white">{me.rankLabel}</p>
                </div>
                <div className="grid h-10 w-12 place-items-center rounded-md border border-gold/40 bg-gold/10">
                  <span className="font-mono text-lg text-gold">$</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">Points</p>
                  <p className="font-mono text-lg font-bold text-neon">{num(me.totalPoints)}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">Cashback</p>
                  <p className="font-mono text-lg font-bold text-gold">{num(me.cashbackBalance)}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">Streak</p>
                  <p className="font-mono text-lg font-bold text-electric">{num(me.streak)}🔥</p>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">Degen Score</p>
                  <p className="font-mono text-2xl font-bold tracking-wider text-white">{num(me.degenScore)}</p>
                </div>
                <p className="font-mono text-sm tracking-widest text-white/70">{shortAddr(me.walletAddress)}</p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <p className="section-label">Flex it</p>
          <p className="mt-2 text-sm text-white/55">
            Your card updates live with your stats. Download the image, then post it with the BankCash launch hashtags.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <button onClick={download} disabled={busy} className="btn-neon w-full disabled:opacity-40">
              {busy ? 'Rendering…' : 'Download card image'}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost w-full"
            >
              Share to X
            </a>
          </div>
          <p className="mt-5 font-mono text-xs text-white/35">
            Tip: download the PNG first, then attach it to your post so the card shows up in the timeline.
          </p>
        </Card>
      </div>
    </>
  );
}

export default function CardPage() {
  return (
    <>
      <NavBar />
      <PageShell>
        <RequireAuth>
          <CardInner />
        </RequireAuth>
      </PageShell>
    </>
  );
}
