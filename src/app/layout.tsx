import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'
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
      <html lang="es" className={`${montserrat.variable} ${inter.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
          <Navbar />
          <main className="grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-slate-100 border-t border-slate-200 py-8">
            <div className="container mx-auto px-4 text-center text-slate-600">
              <p>&copy; 2026 AguaYa. Todos los derechos reservados.</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}