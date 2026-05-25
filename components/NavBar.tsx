'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useLogin } from '@/lib/useLogin';
import { useAuth } from '@/lib/store';
import { BankCashLogo } from './Brand';

const LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/vault', label: 'Vault' },
  { href: '/spin', label: 'Spin' },
  { href: '/missions', label: 'Missions' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/referral', label: 'Refer' },
  { href: '/card', label: 'Card' },
];
const GITHUB_URL = 'https://github.com/Bankcash2026/bankcash-web-public';

export function NavBar() {
  const pathname = usePathname();
  const { login, loading, isConnected, address } = useLogin();
  const token = useAuth((s) => s.token);

  // Auto-prompt signature once a wallet connects but we don't yet hold a session.
  useEffect(() => {
    if (isConnected && address && !token) {
      const pendingRef =
        typeof window !== 'undefined' ? localStorage.getItem('bankcash-ref') || undefined : undefined;
      void login(pendingRef);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, token]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-ink-900/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-5">
        <Link href="/" className="shrink-0">
          <BankCashLogo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 font-mono text-sm transition-colors ${
                  active ? 'text-neon' : 'text-white/55 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <a
            href="https://x.com/bankcash_"
            target="_blank"
            rel="noreferrer"
            aria-label="BankCash on X"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-sm text-white/70 transition-colors hover:border-neon/45 hover:text-white"
          >
            <span className="font-display font-bold">X</span>
            <span className="hidden xl:inline">@bankcash_</span>
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="BankCash public GitHub repository"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-sm text-white/70 transition-colors hover:border-neon/45 hover:text-white"
          >
            <span className="font-display font-bold">GH</span>
            <span className="hidden 2xl:inline">Public Repo</span>
          </a>
          {isConnected && !token && (
            <button onClick={() => login()} disabled={loading} className="btn-neon !px-4 !py-2 text-sm">
              {loading ? 'Signing…' : 'Sign In'}
            </button>
          )}
          <ConnectButton
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
      <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="Mobile navigation">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 rounded-lg px-3 py-2 font-mono text-xs transition-colors ${
                active ? 'bg-neon/10 text-neon' : 'text-white/55 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
