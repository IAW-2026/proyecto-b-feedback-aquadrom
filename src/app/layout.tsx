import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <html
        lang="es" 
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
          {/* El Navbar queda fijo en la parte superior de todas las páginas */}
          <Navbar />
          
          {/* El contenedor principal crece para ocupar el espacio restante */}
          <main className="grow container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Opcional: Podrías agregar un Footer aquí más adelante */}
        </body>
      </html>
    </ClerkProvider>
  );
}