'use client';

import Link from 'next/link';
import { SignInButton, UserButton, Show } from '@clerk/nextjs';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-white text-slate-900 shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Título */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xl font-headline font-bold tracking-tight text-primary"
            >
              {/* Uso la imagen del logo, luego cambiarla por una de mejor calidad  */}
              <Image 
                src="/gotasinfondo.png" 
                alt="Logo AguaYa" 
                width={80}
                height={120} 
                className="object-fill"
              />
              <span>
                AguaYa <span className="text-[#007aff]">Feedback</span>
              </span>
            </Link>
          </div>

          {/* Links de Navegación */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/resenas" className="hover:text-primary transition-colors font-body">
              Reseñas
            </Link>
            <Link href="/faqs" className="hover:text-primary transition-colors font-body">
              Ayuda (FAQs)
            </Link>
            
            {/* Sección de Autenticación Dinámica */}
            <div className="border-l border-slate-300 pl-8 flex items-center gap-4">
              
              {/* Esto solo se ve si el usuario NO está logueado */}
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all font-body">
                    Entrar
                  </button>
                </SignInButton>
              </Show>

              {/* Esto solo se ve si el usuario SÍ está logueado */}
              <Show when="signed-in">
                <Link href="/admin" className="text-sm bg-slate-100 px-3 py-1 rounded hover:bg-slate-200 transition-colors font-body">
                  Panel Admin
                </Link>
                {/* El UserButton ya incluye la opción de 'Sign Out' internamente */}
                <UserButton />
              </Show>

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}