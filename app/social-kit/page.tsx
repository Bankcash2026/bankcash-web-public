'use client';
import { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { PageShell, PageHeading, Card } from '@/components/ui';

const POSTS = [
  {
    title: 'X Launch Post',
    body: `BankCash Rewards Bank is opening the vault.
Save tokens. Spin fortune. Earn cashback like a true degen.
The first meme bank where your funds are emotionally safe.`,
  },
  {
    title: 'CA Post Template',
    body: `BankCash is live.
The degen bank has opened its vault.
CA: [CONTRACT_ADDRESS]
Save. Spin. Earn. Repeat.`,
  },
  {
    title: 'Daily Reward Post',
    body: `Another day, another bag.
Claim your daily BankCash reward, keep your streak alive, and spin the fortune wheel.
The vault never closes for degens.`,
  },
];

const BANNERS = [
  { label: 'Official BankCash logo', src: '/assets/logo/bankcash-logo.jpg' },
  { label: 'X / Twitter banner', src: '/assets/social/x-banner.svg' },
  { label: 'Launch banner', src: '/assets/social/launch-banner.svg' },
];

function CopyBlock({ title, body }: { title: string; body: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-white">{title}</h3>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(body);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-md bg-neon/15 px-3 py-1 font-mono text-xs text-neon"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre className="mt-3 whitespace-pre-wrap font-mono text-sm leading-relaxed text-white/65">{body}</pre>
    </Card>
  );
}

export default function SocialKitPage() {
  return (
    <>
      <NavBar />
      <PageShell>
        <PageHeading
          kicker="Social Kit"
          title="Spread the degen gospel"
          sub="Copy-ready launch posts and banner assets. Swap [CONTRACT_ADDRESS] for the live CA before posting."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {POSTS.map((p) => (
            <CopyBlock key={p.title} {...p} />
          ))}
        </div>

        <h2 className="mt-10 font-display text-xl font-bold text-white">Banner assets</h2>
        <p className="mt-1 text-sm text-white/50">
          Official brand artwork and social templates live in{' '}
          <span className="font-mono text-white/70">/public/assets/</span>.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {BANNERS.map((b) => (
            <Card key={b.label} className="!p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.src} alt={b.label} className="aspect-[1200/630] w-full rounded-lg object-cover" />
              <p className="mt-2 font-mono text-xs text-white/50">{b.label}</p>
            </Card>
          ))}
        </div>
      </PageShell>
    </>
  );
}
