import Link from 'next/link';
import type { ReactNode } from 'react';
import { NavBar } from '@/components/NavBar';

const NAV_GROUPS = [
  {
    title: 'Getting started',
    links: [
      { id: 'overview', label: 'Overview' },
      { id: 'quick-start', label: 'Quick start' },
      { id: 'wallet-access', label: 'Wallet access' },
    ],
  },
  {
    title: 'Rewards',
    links: [
      { id: 'daily-rewards', label: 'Daily rewards' },
      { id: 'vault', label: 'The Vault' },
      { id: 'lucky-spin', label: 'Lucky Spin' },
      { id: 'ranks-referrals', label: 'Ranks and referrals' },
    ],
  },
  {
    title: 'Reference',
    links: [
      { id: 'public-links', label: 'Official links' },
      { id: 'security', label: 'Security' },
      { id: 'disclaimer', label: 'Disclaimer' },
    ],
  },
];

const ON_THIS_PAGE = NAV_GROUPS.flatMap((group) => group.links);

function DocsNavigation({ compact = false }: { compact?: boolean }) {
  return (
    <nav className={compact ? 'grid gap-5 sm:grid-cols-3' : 'space-y-6'} aria-label="Documentation sections">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">{group.title}</p>
          <div className="space-y-1">
            {group.links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="block rounded-lg px-3 py-2 text-sm text-white/62 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function DocsSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-white/8 pt-10 first:border-t-0 first:pt-0">
      <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-white/65 sm:text-[15px]">{children}</div>
    </section>
  );
}

function CheckLine({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon/15 font-mono text-xs text-gold">
        +
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function DocsPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-6 sm:px-6">
        <div className="mb-6 rounded-2xl border border-white/8 bg-white/[0.025] p-4 lg:hidden">
          <details>
            <summary className="cursor-pointer list-none font-mono text-sm text-white/70">
              Browse documentation
            </summary>
            <div className="mt-5 border-t border-white/8 pt-5">
              <DocsNavigation compact />
            </div>
          </details>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[230px_minmax(0,760px)] xl:grid-cols-[230px_minmax(0,760px)_210px]">
          <aside className="sticky top-24 hidden rounded-2xl border border-white/8 bg-white/[0.018] p-4 lg:block">
            <Link href="/docs" className="mb-6 flex items-center gap-3 rounded-xl bg-white/[0.035] p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon/15 font-display text-sm font-bold text-gold">
                BC
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">BankCash Docs</span>
                <span className="block font-mono text-[11px] text-white/40">Public guide</span>
              </span>
            </Link>
            <DocsNavigation />
          </aside>

          <article className="min-w-0">
            <div className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs text-white/38">
              <Link href="/" className="transition-colors hover:text-white/70">
                BankCash
              </Link>
              <span>/</span>
              <span className="text-white/60">Documentation</span>
            </div>

            <header className="mb-12">
              <p className="section-label">Documentation</p>
              <h1 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                BankCash Rewards Bank
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
                Learn how wallet access, rewards, vault interactions, spins, rankings, and public safety boundaries work
                on Base.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#quick-start" className="btn-neon !px-5 !py-2.5 text-sm">
                  Get started
                </a>
                <a href="#security" className="btn-ghost !px-5 !py-2.5 text-sm">
                  Security guide
                </a>
              </div>
            </header>

            <div className="mb-12 grid gap-3 sm:grid-cols-3">
              {[
                ['Network', 'Base', 'Chain ID 8453'],
                ['Access', 'Wallet sign-in', 'No password'],
                ['Scope', 'Rewards app', 'User-signed actions'],
              ].map(([label, value, detail]) => (
                <div key={label} className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-white/38">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                  <p className="mt-1 font-mono text-xs text-white/42">{detail}</p>
                </div>
              ))}
            </div>

            <div className="space-y-12">
              <DocsSection id="overview" title="Overview">
                <p>
                  BankCash is a gamified rewards interface built for the Base community. Users connect an EVM wallet,
                  participate in reward activities, and review their points, streaks, rank, and vault history in one
                  dashboard.
                </p>
                <div className="rounded-xl border border-gold/20 bg-gold/[0.06] p-4 text-white/72">
                  <p className="font-semibold text-white">Non-custodial interaction model</p>
                  <p className="mt-1">
                    Transactions involving tokens must be confirmed in the connected wallet. BankCash never asks for a
                    seed phrase or private key.
                  </p>
                </div>
              </DocsSection>

              <DocsSection id="quick-start" title="Quick start">
                <ol className="space-y-4">
                  {[
                    ['Connect a wallet', 'Use an EVM-compatible wallet connected to the Base network.'],
                    ['Sign in', 'Sign the login message when prompted. Signing in does not spend gas.'],
                    ['Explore rewards', 'Open Dashboard, Missions, Spin, Referral, or Vault from the navigation.'],
                    ['Review every transaction', 'Confirm addresses, amounts, and network details before signing.'],
                  ].map(([title, text], index) => (
                    <li key={title} className="flex gap-4">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neon/30 bg-neon/10 font-mono text-xs text-gold">
                        {index + 1}
                      </span>
                      <span>
                        <strong className="block font-semibold text-white">{title}</strong>
                        <span>{text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </DocsSection>

              <DocsSection id="wallet-access" title="Wallet access">
                <p>
                  Authentication begins with a wallet connection followed by a signature request for the BankCash login
                  message. A signature proves wallet control without revealing a password or transferring funds.
                </p>
                <ul className="space-y-3">
                  <CheckLine>Connect only from the official website at `bcash.fun`.</CheckLine>
                  <CheckLine>Signing a login message should not request token approval or payment.</CheckLine>
                  <CheckLine>Disconnect your wallet session whenever you are using a shared device.</CheckLine>
                </ul>
              </DocsSection>

              <DocsSection id="daily-rewards" title="Daily rewards and streaks">
                <p>
                  Daily reward claims are designed around regular participation. An eligible claim grants base points and
                  may include a spin ticket. Maintaining a streak can improve reward progression shown in the interface.
                </p>
                <p>
                  Eligibility, award amounts, and streak calculations must be confirmed by the active application rules at
                  the time of use; displayed reward programs can evolve.
                </p>
              </DocsSection>

              <DocsSection id="vault" title="The Vault">
                <p>
                  The Vault experience is where token-related deposit and withdrawal interactions are surfaced. Any
                  on-chain action is user-signed through the connected wallet and should be checked before confirmation.
                </p>
                <div className="rounded-xl border border-white/8 bg-[#071020] p-4 font-mono text-xs leading-6 text-white/58">
                  <p className="text-gold">Public network configuration</p>
                  <p>network: Base</p>
                  <p>chain_id: 8453</p>
                  <p>rpc_fallback: https://mainnet.base.org</p>
                </div>
              </DocsSection>

              <DocsSection id="lucky-spin" title="Lucky Spin">
                <p>
                  Lucky Spin turns earned tickets into an animated reward reveal. The wheel is a presentation layer for
                  the result; reward eligibility and recorded outcomes are validated by the application service.
                </p>
                <p>Potential reward categories shown in the product may include points, tickets, cashback, or badges.</p>
              </DocsSection>

              <DocsSection id="ranks-referrals" title="Ranks and referrals">
                <p>
                  Rankings display community progress using reward activity such as points, streaks, vault participation,
                  and successful referrals. Referral sharing uses a public invite link:
                </p>
                <div className="overflow-x-auto rounded-xl border border-white/8 bg-[#071020] px-4 py-3 font-mono text-sm text-gold">
                  https://bcash.fun/ref/CODE
                </div>
                <p>
                  Users should share only their public referral URL. Private wallet credentials are never required for
                  referral participation.
                </p>
              </DocsSection>

              <DocsSection id="public-links" title="Official links">
                <div className="divide-y divide-white/8 rounded-xl border border-white/8 bg-white/[0.018]">
                  {[
                    ['Website', 'https://bcash.fun/', 'https://bcash.fun/'],
                    ['X', 'https://x.com/bankcash_', 'https://x.com/bankcash_'],
                    [
                      'Public GitHub',
                      'https://github.com/Bankcash2026/bankcash-web-public',
                      'https://github.com/Bankcash2026/bankcash-web-public',
                    ],
                  ].map(([label, href, display]) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="font-semibold text-white">{label}</span>
                      <span className="break-all font-mono text-xs text-gold">{display}</span>
                    </a>
                  ))}
                </div>
              </DocsSection>

              <DocsSection id="security" title="Security">
                <ul className="space-y-3">
                  <CheckLine>Never share a seed phrase, private key, or wallet recovery code.</CheckLine>
                  <CheckLine>Validate the website URL and Base network before signing any transaction.</CheckLine>
                  <CheckLine>Read token approvals and transaction values in your wallet before confirming.</CheckLine>
                  <CheckLine>Use the public GitHub repository only for public interface and CLI documentation.</CheckLine>
                </ul>
              </DocsSection>

              <DocsSection id="disclaimer" title="Disclaimer">
                <p>
                  BankCash is a gamified crypto rewards interface. Product documentation describes the public user
                  experience and does not constitute financial advice, investment advice, or a guarantee of rewards.
                </p>
              </DocsSection>
            </div>
          </article>

          <aside className="sticky top-24 hidden xl:block">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">On this page</p>
            <nav className="border-l border-white/8 pl-4" aria-label="On this page">
              {ON_THIS_PAGE.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="block py-1.5 text-xs text-white/48 transition-colors hover:text-gold"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-8 rounded-xl border border-neon/20 bg-neon/[0.06] p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-gold">Public CLI</p>
              <p className="mt-2 text-xs leading-6 text-white/60">Inspect public links and status from the command line.</p>
              <a
                href="https://github.com/Bankcash2026/bankcash-web-public#bankcash-cli"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs font-semibold text-gold hover:text-white"
              >
                View CLI guide -&gt;
              </a>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
