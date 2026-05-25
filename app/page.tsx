'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavBar } from '@/components/NavBar';
import { BankCashSymbol } from '@/components/Brand';
import { VaultDoor } from '@/components/VaultDoor';
import { MoneyParticles } from '@/components/MoneyParticles';

const RANKS = [
  'Broke Visitor',
  'Cash Farmer',
  'Degen Saver',
  'Vault Raider',
  'Gold Bankster',
  'Diamond Whale',
  'Federal Goblin',
];

const STEPS = [
  { n: '01', t: 'Connect & Sign', d: 'Link any EVM wallet on Base and sign a gasless login message. Your keys, your coins — always.' },
  { n: '02', t: 'Save & Stake', d: 'Deposit BANKCASH into the vault. Every save compounds your degen score and unlocks ranks.' },
  { n: '03', t: 'Spin & Earn', d: 'Claim daily rewards, spin the fortune wheel, complete missions, and stack cashback.' },
  { n: '04', t: 'Climb & Flex', d: 'Rise up the leaderboard, raid the lucky vault, and mint a shareable BankCash card.' },
];

const FEATURES = [
  {
    label: 'Save Token',
    title: 'A vault that pays you to hodl',
    body: 'Deposit BANKCASH into a non-custodial vault. Track APY, total value locked, and your personal balance — all signed by you, never held by us.',
    accent: 'neon' as const,
    href: '/vault',
  },
  {
    label: 'Daily Rewards',
    title: 'Show up. Get paid. Repeat.',
    body: 'Claim 100 base points every 24 hours. Streaks ramp your multiplier up to 3× at day 30, and every claim drops a free spin ticket.',
    accent: 'gold' as const,
    href: '/dashboard',
  },
  {
    label: 'Lucky Spin',
    title: 'Spin the fortune wheel',
    body: 'Burn a ticket, spin for points, cashback, bonus tickets, or a jackpot entry. Watch out for the dreaded Bankruptcy slice.',
    accent: 'electric' as const,
    href: '/spin',
  },
  {
    label: 'Cashback',
    title: 'Cashback on basically everything',
    body: 'Earn cashback from daily claims, vault deposits, lucky spins, referrals, and missions. It all pools into one balance.',
    accent: 'neon' as const,
    href: '/dashboard',
  },
];

function StepReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <>
      <NavBar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <MoneyParticles count={18} />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 lg:grid-cols-2 lg:pt-20">
          <div className="relative z-10">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-neon" /> Live on Base · Non-custodial
            </span>
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl">
              The first <span className="text-gradient-neon">rewards bank</span> for{' '}
              <span className="text-gradient-gold">degens</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/60">
              Save Tokens. Spin Fortune. Bank Like A Degen. The only meme bank where your funds are{' '}
              <span className="text-white/90">emotionally safe.</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ConnectButton.Custom>
                {({ openConnectModal, account }) => (
                  <button onClick={openConnectModal} className="btn-neon text-base">
                    {account ? 'Enter the Vault' : 'Connect Wallet'}
                  </button>
                )}
              </ConnectButton.Custom>
              <Link href="/docs" className="btn-ghost">
                How it works
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/8 pt-6">
              {[
                ['7', 'Degen ranks'],
                ['10', 'Spin outcomes'],
                ['3×', 'Max daily streak'],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="stat-num font-display text-2xl font-bold text-white">{v}</p>
                  <p className="font-mono text-xs uppercase tracking-widest text-white/40">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 grid place-items-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <VaultDoor size={420} />
            </motion.div>
            <div className="brand-hero-float absolute bottom-6 right-5 sm:bottom-8 sm:right-14 lg:right-8">
              <BankCashSymbol size={76} />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <p className="section-label">How it works</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Four moves to financial chaos
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <StepReveal key={s.n} delay={i * 0.08}>
              <div className="glass h-full p-6">
                <p className="font-mono text-sm text-neon/70">{s.n}</p>
                <h3 className="mt-3 font-display text-lg font-bold text-white">{s.t}</h3>
                <p className="mt-2 text-sm text-white/55">{s.d}</p>
              </div>
            </StepReveal>
          ))}
        </div>
      </section>

      {/* FEATURE BLOCKS */}
      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {FEATURES.map((f, i) => (
            <StepReveal key={f.label} delay={i * 0.06}>
              <Link
                href={f.href}
                className={`glass group block h-full p-7 transition-transform hover:-translate-y-1 ${
                  f.accent === 'gold' ? 'glass-gold' : f.accent === 'neon' ? 'glass-neon' : ''
                }`}
              >
                <p
                  className={`font-mono text-xs uppercase tracking-[0.3em] ${
                    f.accent === 'gold' ? 'text-gold/80' : f.accent === 'electric' ? 'text-electric/80' : 'text-neon/80'
                  }`}
                >
                  {f.label}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold text-white">{f.title}</h3>
                <p className="mt-3 text-white/55">{f.body}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-sm text-white/50 transition-colors group-hover:text-neon">
                  Open →
                </span>
              </Link>
            </StepReveal>
          ))}
        </div>
      </section>

      {/* LUCKY VAULT BANNER */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="glass glass-gold relative overflow-hidden p-10">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative">
            <p className="section-label !text-gold/80">Lucky Vault</p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              One global jackpot. Every entry tilts fate your way.
            </h2>
            <p className="mt-4 max-w-2xl text-white/60">
              Throw in points or spin tickets to enter the communal Lucky Vault. When the bank manager pulls the lever, one
              degen walks away with the whole pot plus a one-of-one badge.
            </p>
            <Link href="/spin" className="btn-neon mt-7">
              Enter the Lucky Vault
            </Link>
          </div>
        </div>
      </section>

      {/* RANKS / LEADERBOARD */}
      <section className="mx-auto max-w-7xl px-5 py-8">
        <p className="section-label">Ranks &amp; Leaderboard</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          From Broke Visitor to Federal Goblin
        </h2>
        <p className="mt-3 max-w-2xl text-white/55">
          Your rank blends points, vault balance, streak, and referrals into a single degen score. Climb the ladder, top
          the boards, and earn bragging rights.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {RANKS.map((r, i) => (
            <div
              key={r}
              className="chip !text-sm"
              style={{ borderColor: i >= 5 ? 'rgba(96,165,250,0.45)' : undefined }}
            >
              <span className="text-white/40">{i + 1}.</span>
              <span className={i >= 5 ? 'text-gold' : 'text-white/80'}>{r}</span>
            </div>
          ))}
        </div>
        <Link href="/leaderboard" className="btn-ghost mt-8">
          View leaderboard
        </Link>
      </section>

      {/* ROADMAP */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <p className="section-label">Roadmap</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          The vault expansion plan
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {[
            { q: 'Phase 1', t: 'Open the Vault', items: ['Wallet auth', 'Daily rewards', 'Lucky spin', 'Referrals'] },
            { q: 'Phase 2', t: 'Stack the Bank', items: ['Vault staking', 'Missions v2', 'Shareable cards', 'Leaderboards'] },
            { q: 'Phase 3', t: 'Onchain Rewards', items: ['Token claim', 'Onchain Lucky Vault', 'Rank NFTs'] },
            { q: 'Phase 4', t: 'Degen Empire', items: ['Mobile app', 'Partner cashback', 'DAO treasury'] },
          ].map((p, i) => (
            <StepReveal key={p.q} delay={i * 0.08}>
              <div className={`glass h-full p-6 ${i === 0 ? 'glass-neon' : ''}`}>
                <p className="font-mono text-xs uppercase tracking-widest text-neon/70">{p.q}</p>
                <h3 className="mt-2 font-display text-lg font-bold text-white">{p.t}</h3>
                <ul className="mt-4 space-y-2">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-sm text-white/55">
                      <span className="h-1 w-1 rounded-full bg-neon/60" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            </StepReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-10">
        <div className="glass glass-neon relative overflow-hidden p-12 text-center">
          <div className="absolute inset-x-0 -top-20 mx-auto h-40 w-40 rounded-full bg-neon/30 blur-3xl" />
          <h2 className="relative font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your funds are <span className="text-gradient-neon">emotionally safe.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/60">
            Connect your wallet and open an account at the only bank that rewards you for being a degen.
          </p>
          <div className="relative mt-8 flex justify-center">
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button onClick={openConnectModal} className="btn-neon text-base">
                  Open my degen account
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      </section>
    </>
  );
}
