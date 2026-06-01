import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from '../components/Providers';
import { ThemeScript } from '../components/ThemeScript';
import Navbar from "../components/Navbar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Feedback App - AguaYa",
  description: "Sistema de generación de reseñas y atención al cliente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" className={`${montserrat.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning>
         <body className="min-h-full flex flex-col bg-white text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
          <Providers>
            <ThemeScript />
            <Navbar />
            <main className="grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-slate-100 border-t border-slate-200 py-8 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
              <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
                <p>&copy; 2026 AguaYa. Todos los derechos reservados.</p>
              </div>
            </footer>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}