import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StreamFlix - Watch Movies & TV Shows Online',
  description: 'Stream your favorite movies and TV shows anytime, anywhere. The ultimate entertainment destination.',
  keywords: ['streaming', 'movies', 'tv shows', 'entertainment', 'watch online'],
  authors: [{ name: 'StreamFlix' }],
  openGraph: {
    title: 'StreamFlix',
    description: 'Watch Movies & TV Shows Online',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://pl28437089.effectivegatecpm.com/13/ba/2a/13ba2a458a513d263d79ef92472458dd.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} bg-netflix-black min-h-screen flex flex-col`}>
        <ReduxProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReduxProvider>
        {/* Social Bar Ad - loads at bottom of body */}
        <Script
          src="https://pl28437189.effectivegatecpm.com/e6/2e/ca/e62eca42f9bc6194985666346594514c.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
