'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { NavBar } from '@/components/NavBar';
import { PageShell, Card } from '@/components/ui';

export default function RefCapturePage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = params?.code;

  useEffect(() => {
    if (code) localStorage.setItem('bankcash-ref', String(code).toUpperCase());
    const t = setTimeout(() => router.replace('/dashboard'), 1600);
    return () => clearTimeout(t);
  }, [code, router]);

  return (
    <>
      <NavBar />
      <PageShell>
        <div className="mx-auto mt-16 max-w-md text-center">
          <Card className="glass-neon">
            <p className="section-label">Invitation accepted</p>
            <h1 className="mt-3 font-display text-2xl font-bold text-white">
              You were invited with code <span className="text-gradient-neon">{code}</span>
            </h1>
            <p className="mt-3 text-white/55">
              Connect your wallet and sign in — your bonus spin ticket will be applied automatically on first login.
            </p>
          </Card>
        </div>
      </PageShell>
    </>
  );
}
