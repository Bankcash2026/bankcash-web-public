import type { Metadata } from 'next';
import { Unbounded, Sora, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SiteFooter } from '@/components/SiteFooter';

const display = Unbounded({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' });
const body = Sora({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'BankCash Rewards Bank — Save Tokens. Spin Fortune. Bank Like A Degen.',
  description:
    'The first rewards bank for degens. Save BANKCASH, spin the fortune wheel, claim cashback, climb ranks, and raid the lucky vault. Your funds are emotionally safe.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bankcash-web.vercel.app'),
  openGraph: {
    title: 'BankCash Rewards Bank',
    description: 'Save Tokens. Spin Fortune. Bank Like A Degen.',
    images: ['/assets/logo/bankcash-logo.jpg'],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-vaultroom grain min-h-screen">
        <Providers>
          <div className="relative z-[2]">{children}</div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
