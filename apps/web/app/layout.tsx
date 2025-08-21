// apps/web/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import LegalOverlay from '../components/LegalOverlay/LegalOverlay';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-main',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'ThePregames - Ultimate Drinking Games App',
  description: 'Level up your pregame with drinking games, recipes, and tournaments. Perfect for parties and game nights.',
  keywords: 'drinking games, pregame, party games, beer games, cocktail recipes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body>
        <LegalOverlay />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}