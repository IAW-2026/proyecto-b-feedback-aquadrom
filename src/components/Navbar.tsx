'use client';

import Link from 'next/link';
import { SignInButton, SignOutButton, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Título */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tight text-blue-400">
              AguaYa <span className="text-white">Feedback</span>
            </Link>
          </div>

          {/* Links de Navegación */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/resenas" className="hover:text-blue-400 transition-colors">
              Reseñas
            </Link>
            <Link href="/faqs" className="hover:text-blue-400 transition-colors">
              Ayuda (FAQs)
            </Link>
            
            {/* Sección de Autenticación */}
            <div className="border-l border-slate-700 pl-8 flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  Entrar
                </button>
              </SignInButton>

              <SignOutButton>
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  Salir
                </button>
              </SignOutButton>

              <Link href="/admin" className="text-sm bg-slate-800 px-3 py-1 rounded hover:bg-slate-700">
                Panel Admin
              </Link>
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}