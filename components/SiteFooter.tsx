import { BankCashLogo } from './Brand';

const SOCIALS = [
  { label: 'X / Twitter', href: 'https://x.com/bankcash_' },
  { label: 'GitHub', href: 'https://github.com/Bankcash2026/bankcash-web-public' },
  { label: 'Docs', href: '/docs' },
  { label: 'Social Kit', href: '/social-kit' },
];

export function SiteFooter() {
  return (
    <footer className="relative z-[2] mt-24 border-t border-white/8 bg-ink-900/60">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <BankCashLogo />
            <p className="mt-4 font-mono text-sm text-white/45">
              The first rewards bank for degens. Save. Spin. Earn. Repeat.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} className="font-mono text-sm text-white/60 transition-colors hover:text-neon">
                {s.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="font-mono text-xs leading-relaxed text-white/40">
            BankCash Rewards Bank is a gamified crypto rewards platform. Nothing here is financial advice. Use at your own
            risk.
          </p>
        </div>
        <p className="mt-6 font-mono text-xs text-white/25">© {new Date().getFullYear()} BankCash Rewards Bank.</p>
      </div>
    </footer>
  );
}
