'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/store';
import { useLogin } from '@/lib/useLogin';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-7xl px-5 pb-24 pt-10">{children}</main>;
}

export function PageHeading({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-8">
      <p className="section-label">{kicker}</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h1>
      {sub && <p className="mt-3 max-w-2xl text-white/55">{sub}</p>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  accent = 'neon',
  hint,
}: {
  label: string;
  value: ReactNode;
  accent?: 'neon' | 'gold' | 'electric' | 'white';
  hint?: string;
}) {
  const color =
    accent === 'gold'
      ? 'text-gold'
      : accent === 'electric'
        ? 'text-electric'
        : accent === 'white'
          ? 'text-white'
          : 'text-neon';
  return (
    <div className="glass p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-white/45">{label}</p>
      <p className={`stat-num mt-2 text-2xl font-bold sm:text-3xl ${color}`}>{value}</p>
      {hint && <p className="mt-1 font-mono text-xs text-white/35">{hint}</p>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass p-6 ${className}`}>{children}</div>;
}

/** Wraps a page that requires a signed-in session; shows a connect/sign gate otherwise. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const token = useAuth((s) => s.token);
  const { login, loading, isConnected } = useLogin();

  if (token) return <>{children}</>;

  return (
    <div className="mx-auto mt-16 max-w-md text-center">
      <div className="glass glass-neon p-8">
        <h2 className="font-display text-2xl font-bold text-white">Vault locked</h2>
        <p className="mt-3 text-white/55">
          Connect your wallet and sign the BankCash login message to access your degen banking dashboard.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <ConnectButton />
          {isConnected && (
            <button onClick={() => login()} disabled={loading} className="btn-neon w-full">
              {loading ? 'Signing…' : 'Sign Login Message'}
            </button>
          )}
        </div>
        <p className="mt-4 font-mono text-xs text-white/35">
          Signing is gasless. We never custody your funds.
        </p>
      </div>
      <Link href="/" className="mt-6 inline-block font-mono text-sm text-white/40 hover:text-neon">
        ← Back home
      </Link>
    </div>
  );
}

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-sm text-white/50">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-neon/30 border-t-neon" />
      {label}
    </div>
  );
}

export function num(n: number | string | undefined | null): string {
  const v = typeof n === 'string' ? Number(n) : (n ?? 0);
  return Number.isFinite(v) ? v.toLocaleString('en-US') : '0';
}

export function shortAddr(a?: string | null): string {
  if (!a) return '—';
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}
