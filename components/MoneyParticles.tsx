'use client';
import { useMemo } from 'react';

// Cheap, GPU-friendly floating coins. Positions/timing randomized once on mount.
export function MoneyParticles({ count = 14 }: { count?: number }) {
  const coins = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 12,
        size: 14 + Math.random() * 22,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {coins.map((c) => (
        <span
          key={c.id}
          className="absolute grid place-items-center rounded-full font-mono font-bold text-gold"
          style={{
            left: `${c.left}%`,
            bottom: '-10vh',
            width: c.size,
            height: c.size,
            fontSize: c.size * 0.5,
            opacity: c.opacity,
            background: 'radial-gradient(circle at 35% 30%, #93C5FD, #2563FF 55%, #001E66)',
            color: '#E0F2FE',
            animation: `rise ${c.duration}s linear ${c.delay}s infinite`,
          }}
        >
          $
        </span>
      ))}
    </div>
  );
}
