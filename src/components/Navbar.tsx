'use client';

import Link from 'next/link';
import { SignInButton, UserButton, Show } from '@clerk/nextjs';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Título */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xl font-headline font-bold tracking-tight text-primary"
            >
              {/* Imagen del logo */}
              <Image 
                src="/favicon-removebg-preview.png" 
                alt="Logo AguaYa" 
                width={38}
                height={78} 
                className="object-fill"
              />
              <span className="text-base sm:text-xl">
                AguaYa <span className="text-[#007aff]">Feedback</span>
              </span>
            </Link>
          </div>
        
          {/* Botón Hamburguesa para Mobile */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>

          {/* Links de Navegación */}
          <div className={`${isOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-white dark:bg-slate-900 md:bg-transparent flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-center p-4 md:p-0 border-b md:border-b-0 border-slate-200 dark:border-slate-800 z-50`}>
            
            {/* Sección de Autenticación Dinámica */}
            <div className="w-full md:w-auto border-l-0 md:border-l border-slate-300 pl-0 md:pl-8 flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-4">
                <ThemeToggle />
                {/* Esto solo se ve si el usuario NO está logueado */}
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all font-body">
                      Entrar
                    </button>
                  </SignInButton>
                </Show>
              </div>

              {/* Esto solo se ve si el usuario SÍ está logueado */}
              <Show when="signed-in">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                  <Link href="/admin" className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-body">
                    Panel Admin
                  </Link>
                  <UserButton />
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
