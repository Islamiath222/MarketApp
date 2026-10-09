import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MarketApp — Lagos Market Navigator',
    template: '%s | MarketApp',
  },
  description:
    'Discover, navigate, and shop verified physical markets in Lagos, Nigeria. Virtual 360° market tours, haggle with traders, and get items delivered.',
  keywords: [
    'Lagos market',
    'Nigerian market',
    'Balogun market',
    'Computer Village',
    'online market Nigeria',
    'buy Nigerian goods',
    'market navigation',
  ],
  authors: [{ name: 'MarketApp' }],
  creator: 'MarketApp',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://marketapp.ng',
    siteName: 'MarketApp',
    title: 'MarketApp — Lagos Market Navigator',
    description: 'Virtually walk through Lagos markets, discover shops, haggle, and buy.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarketApp — Lagos Market Navigator',
    description: 'Virtually walk through Lagos markets, discover shops, haggle, and buy.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
