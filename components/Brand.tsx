import Image from 'next/image';

const LOGO_SRC = '/assets/logo/bankcash-logo.jpg';

export function BankCashLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <span className="brand-mark relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
        <Image
          src={LOGO_SRC}
          alt="BankCash logo"
          width={40}
          height={40}
          className="relative z-[1] h-10 w-10 object-cover"
          priority
        />
        <span className="absolute inset-0 rounded-xl shadow-[0_0_24px_-6px_rgba(0,82,255,0.65)]" />
      </span>
      <span className="hidden font-display text-xl font-extrabold tracking-tight text-white sm:inline">
        Bank<span className="text-gradient-neon">Cash</span>
      </span>
    </span>
  );
}

export function BankCashSymbol({ size = 56 }: { size?: number }) {
  return (
    <span
      className="brand-mark relative inline-grid place-items-center overflow-hidden rounded-2xl bg-white"
      style={{ width: size, height: size }}
    >
      <Image src={LOGO_SRC} alt="BankCash" width={size} height={size} className="object-cover" />
    </span>
  );
}
