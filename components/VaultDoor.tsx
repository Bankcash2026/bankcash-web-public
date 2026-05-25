'use client';
import { motion } from 'framer-motion';

export function VaultDoor({ size = 380 }: { size?: number }) {
  return (
    <div className="relative grid aspect-square w-full place-items-center" style={{ maxWidth: size }}>
      {/* radiant backglow */}
      <div className="absolute inset-0 animate-pulseGlow rounded-full bg-neon/30 blur-3xl" />
      <div className="absolute inset-8 rounded-full bg-gold/15 blur-2xl" />

      <svg viewBox="0 0 400 400" className="relative h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
        <defs>
          <radialGradient id="vaultBody" cx="50%" cy="42%">
            <stop offset="0%" stopColor="#162B5C" />
            <stop offset="100%" stopColor="#050A14" />
          </radialGradient>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#0052FF" />
          </linearGradient>
        </defs>

        {/* outer frame */}
        <rect x="30" y="30" width="340" height="340" rx="40" fill="url(#vaultBody)" stroke="url(#ring)" strokeWidth="3" />
        <rect x="46" y="46" width="308" height="308" rx="32" fill="none" stroke="rgba(96,165,250,0.3)" strokeWidth="2" />

        {/* door ring */}
        <circle cx="200" cy="200" r="120" fill="#0A1428" stroke="url(#ring)" strokeWidth="6" />

        {/* dashed rotating ring */}
        <motion.circle
          cx="200"
          cy="200"
          r="96"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="4"
          strokeDasharray="14 12"
          style={{ originX: '200px', originY: '200px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        />

        {/* spokes that counter-rotate */}
        <motion.g
          style={{ originX: '200px', originY: '200px' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
          stroke="#0052FF"
          strokeWidth="7"
          strokeLinecap="round"
        >
          <line x1="200" y1="200" x2="200" y2="118" />
          <line x1="200" y1="200" x2="282" y2="200" />
          <line x1="200" y1="200" x2="200" y2="282" />
          <line x1="200" y1="200" x2="118" y2="200" />
        </motion.g>

        {/* hub */}
        <circle cx="200" cy="200" r="22" fill="#2563FF" />
        <circle cx="200" cy="200" r="9" fill="#001E66" />

        {/* bolts */}
        {[60, 60, 340, 340].map((x, i) => {
          const y = i < 2 ? 60 : 340;
          const cx = i % 2 === 0 ? 60 : 340;
          return <circle key={i} cx={cx} cy={y} r="6" fill="#60A5FA" opacity="0.85" />;
        })}
      </svg>
    </div>
  );
}
