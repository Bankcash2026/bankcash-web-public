'use client';
import { NavBar } from '@/components/NavBar';
import { PageShell, PageHeading, Card } from '@/components/ui';

const SECTIONS = [
  {
    h: 'What is BankCash?',
    b: 'BankCash Rewards Bank is a gamified crypto rewards platform on Base. You connect a wallet, save BANKCASH, and earn points, cashback, ranks, and jackpot entries through daily activity. It is non-custodial — you sign every transaction and the platform never holds your funds.',
  },
  {
    h: 'Logging in',
    b: 'Connect any EVM wallet and sign a gasless message ("Login to BankCash Rewards Bank"). The backend verifies the signature, creates or loads your profile, and issues a session token. No passwords, no seed phrases shared.',
  },
  {
    h: 'Daily rewards & streaks',
    b: 'Claim once every 24 hours for 100 base points and a free spin ticket. Keeping a streak multiplies your points: 1× at day 1, 1.2× at day 3, 1.5× at day 7, 2× at day 14, and 3× at day 30. Miss a day and the streak resets.',
  },
  {
    h: 'The Vault',
    b: 'Deposit BANKCASH to grow your degen score and unlock ranks. Deposits and withdrawals are user-signed on-chain transactions; the backend stores a display mirror plus your transaction history. Staking APY shown is a placeholder until the vault contract is deployed.',
  },
  {
    h: 'Lucky Spin',
    b: 'Spend a ticket to spin the fortune wheel. Outcomes range from 50 points up to 500 points, cashback, bonus tickets, and a jackpot entry — plus the dreaded Bankruptcy slice and a rare Rug Insurance Badge. The result is decided server-side with a cryptographically-seeded weighted draw; the wheel only animates the outcome.',
  },
  {
    h: 'Lucky Vault',
    b: 'A communal jackpot. Enter with points or tickets — every entry increases your odds. When an admin triggers the draw, a weighted-random winner takes the pot in points, cashback, and a special badge. Built to migrate to on-chain prize distribution later.',
  },
  {
    h: 'Ranks',
    b: 'Seven tiers from Broke Visitor to Federal Goblin. Your rank is computed from a degen score blending total points, vault balance, streak, and referrals.',
  },
  {
    h: 'Referrals',
    b: 'Share your link (bankcash.fun/ref/CODE). The inviter earns 5 cashback per friend; the invited degen gets a free spin ticket. Self-referral and duplicate referrals are blocked.',
  },
  {
    h: 'Security',
    b: 'Wallet-signature auth, JWT expiry, Redis rate limiting, CORS whitelist, zod input validation, helmet headers, admin allowlist, and anti-spam on daily claims and spins. No private keys are ever stored. On-chain transaction-hash verification guards vault logging.',
  },
];

export default function DocsPage() {
  return (
    <>
      <NavBar />
      <PageShell>
        <PageHeading
          kicker="Docs"
          title="How the bank works"
          sub="Everything you need to know about saving, spinning, and climbing the degen leaderboard."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {SECTIONS.map((s) => (
            <Card key={s.h}>
              <h2 className="font-display text-lg font-bold text-white">{s.h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{s.b}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="font-mono text-xs leading-relaxed text-white/40">
            BankCash Rewards Bank is a gamified crypto rewards platform. Nothing here is financial advice. Use at your own
            risk.
          </p>
        </div>
      </PageShell>
    </>
  );
}
