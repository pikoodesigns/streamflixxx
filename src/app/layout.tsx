import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
      <body className={`${inter.className} bg-netflix-black min-h-screen flex flex-col`}>
        <ReduxProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
