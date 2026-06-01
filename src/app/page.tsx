import Image from "next/image";
import { Star, MessageSquareText, CircleQuestionMark, MessageSquareHeart } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center mt-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-blue-900 dark:text-blue-300 leading-tight">
          ¿Cómo podemos ayudarte?
        </h1>
      </section>

      {/* Category Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/faqs" className="block">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-[#005BC1]/30 flex flex-col items-center text-center space-y-4 cursor-pointer group">
          <div className="w-14 h-14 rounded-full bg-[#005BC1]/10 flex items-center justify-center text-[#005BC1] group-hover:scale-110 group-hover:bg-[#005BC1] group-hover:text-white transition-all duration-300">
            <CircleQuestionMark className="text-3xl" />
          </div>

          <div className="space-y-1">
            <h2 className="font-headline text-xl font-bold text-slate-800 group-hover:text-[#005BC1] transition-colors">
              Preguntas Frecuentes
            </h2>
            <p className="text-sm text-slate-500 font-body leading-relaxed">
              Guía de ayuda rápida sobre el uso de la app y detalles del servicio.
            </p>
          </div>
        </div>  
        </Link>

       <Link href="/review" className="block"> 
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-[#005BC1]/30 flex flex-col items-center text-center space-y-4 cursor-pointer group">
        <div className="w-14 h-14 rounded-full bg-[#005BC1]/10 flex items-center justify-center text-[#005BC1] group-hover:scale-110 group-hover:bg-[#005BC1] group-hover:text-white transition-all duration-300">
          <MessageSquareText className="text-3xl" />
        </div>
        <div className="space-y-1">
          <h2 className="font-headline text-xl font-bold text-slate-800 group-hover:text-[#005BC1] transition-colors">
            Tus Reseñas
          </h2>
          <p className="text-sm text-slate-500 font-body leading-relaxed">
            Comparte tu experiencia con nuestros servicios y proveedores.
          </p>
        </div>
      </div>
    </Link>

      <Link href="/value-us" className="block">
       <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-[#005BC1]/30 flex flex-col items-center text-center space-y-4 cursor-pointer group">
        <div className="w-14 h-14 rounded-full bg-[#005BC1]/10 flex items-center justify-center text-[#005BC1] group-hover:scale-110 group-hover:bg-[#005BC1] group-hover:text-white transition-all duration-300">
          <Star className="text-3xl" />
        </div>
        <div className="space-y-1">
          <h2 className="font-headline text-xl font-bold text-slate-800 group-hover:text-[#005BC1] transition-colors">
            Valóranos
          </h2>
          <p className="text-sm text-slate-500 font-body leading-relaxed">
            Tu feedback es la herramienta principal para mejorar nuestro servicio.
          </p>
        </div>
      </div> 
      </Link>

        <Link href="/resenas" className="block md:col-span-full">
       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm dark:shadow-slate-900/60 hover:shadow-md transition-all border border-blue-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 flex flex-col items-center text-center space-y-4 cursor-pointer group">
        <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center text-blue-700 dark:text-blue-200 group-hover:scale-110 group-hover:bg-blue-600 dark:group-hover:bg-blue-700 group-hover:text-white transition-all duration-300">
          <MessageSquareHeart className="text-3xl" />
        </div>
        <div className="space-y-1">
          <h2 className="font-headline text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
            Ver Reseñas
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-body leading-relaxed">
            Busca y consulta las opiniones de otros clientes sobre nuestros proveedores.
          </p>
        </div>
      </div> 
      </Link>

      </section>


      
  <section className="group relative h-100 w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-500 hover:shadow-primary/20">
  <Image
    src="/aguaya-bidones-component.png"
    alt="Aguaya bidones"
    fill
    priority
    className="object-cover transition-transform duration-700 group-hover:scale-105" 
  />

  <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/40 to-transparent">
    <div className="flex h-full flex-col justify-center max-w-2xl px-8 md:px-16 space-y-6">
      


      <h2 className="text-4xl md:text-6xl font-headline font-bold leading-[1.1] text-white drop-shadow-md">
        Comprometidos con tu <span className="text-blue-400">bienestar</span>
      </h2>

      <p className="text-lg md:text-xl font-body text-slate-200 opacity-90 max-w-lg leading-relaxed">
        Agua pura, logística eficiente y atención personalizada. Elevamos el estándar de hidratación en cada entrega.
      </p>

      {/* Botón de Acción (Call to Action) para linkear despues a about us*/}
      <div className="pt-4">
        <Link href="/about-us" className="inline-flex bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-blue-500/30">
          Conocer más
        </Link>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}