// src/app/not-found.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      
      {/* Contenedor de la imagen */}
      <div className="relative w-64 h-64 mb-8">
        <Image 
          src="/gotasad.png" 
          alt="Página no encontrada"
          fill
          className="object-contain opacity-60"
          priority
        />
      </div>

      {/* Contenido */}
      <h1 className="text-8xl font-black text-[#005BC1] mb-2">404</h1>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">¡Ups! Nos perdimos</h2>
      <p className="text-slate-600 mb-10 max-w-sm">
        La página que buscas no existe o ha sido movida. Pero no te preocupes, el agua sigue fluyendo.
      </p>

      {/* Acción principal */}
      <Link 
        href="/" 
        className="bg-[#005BC1] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#004a9e] transition-all shadow-lg shadow-[#005BC1]/20 active:scale-95"
      >
        Volver al inicio
      </Link>
    </main>
  );
}