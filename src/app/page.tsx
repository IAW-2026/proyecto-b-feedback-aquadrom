import Image from "next/image";
import { Search, Truck, Recycle, CreditCard, HelpCircle, ChevronDown, Droplets, Star, MessageSquareText, CircleQuestionMark } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Search Section  */}
      <section className="mt-8 text-center space-y-6">
        <h1 className="font-headline text-5xl text-slate-900">
          ¿Cómo podemos ayudarte? 
        </h1>
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="text-primary text-2xl" />
          </div>
          <input 
            className="w-full pl-15 pr-6 py-6 rounded-xl border-none bg-white shadow-md focus:ring-2 focus:ring-primary/20 transition-shadow text-lg"
            placeholder="Busca respuestas sobre proveedores, bidones o sobre la app..." // 
            type="text"
          />
        </div>
      </section>

      {/* Category Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/faqs" className="block">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-[#005BC1]/30 flex flex-col items-center text-center space-y-4 cursor-pointer group">
          <div className="w-14 h-14 rounded-full bg-[#005BC1]/10 flex items-center justify-center text-[#005BC1] group-hover:scale-110 group-hover:bg-[#005BC1] group-hover:text-white transition-all duration-300">
            <CircleQuestionMark className="text-3xl" />
          </div>

          <div className="space-y-1">
            <h3 className="font-headline text-xl font-bold text-slate-800 group-hover:text-[#005BC1] transition-colors">
              Preguntas Frecuentes
            </h3>
            <p className="text-sm text-slate-500 font-body leading-relaxed">
              Guía de ayuda rápida sobre el uso de la app y detalles del servicio.
            </p>
          </div>
        </div>  
        </Link>
        
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-[#005BC1]/30 flex flex-col items-center text-center space-y-4 cursor-pointer group">
        <div className="w-14 h-14 rounded-full bg-[#005BC1]/10 flex items-center justify-center text-[#005BC1] group-hover:scale-110 group-hover:bg-[#005BC1] group-hover:text-white transition-all duration-300">
          <MessageSquareText className="text-3xl" />
        </div>
        <div className="space-y-1">
          <h3 className="font-headline text-xl font-bold text-slate-800 group-hover:text-[#005BC1] transition-colors">
            Reseñas
          </h3>
          <p className="text-sm text-slate-500 font-body leading-relaxed">
            Comparte tu experiencia con nuestros servicios y proveedores.
          </p>
        </div>
      </div>

      <Link href="/value-us" className="block">
       <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-[#005BC1]/30 flex flex-col items-center text-center space-y-4 cursor-pointer group">
        <div className="w-14 h-14 rounded-full bg-[#005BC1]/10 flex items-center justify-center text-[#005BC1] group-hover:scale-110 group-hover:bg-[#005BC1] group-hover:text-white transition-all duration-300">
          <Star className="text-3xl" />
        </div>
        <div className="space-y-1">
          <h3 className="font-headline text-xl font-bold text-slate-800 group-hover:text-[#005BC1] transition-colors">
            Valóranos
          </h3>
          <p className="text-sm text-slate-500 font-body leading-relaxed">
            Tu feedback es la herramienta principal para mejorar nuestro servicio.
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
        Comprometidos con tu <span className="text-[#007aff]">bienestar</span>
      </h2>

      <p className="text-lg md:text-xl font-body text-slate-200 opacity-90 max-w-lg leading-relaxed">
        Agua pura, logística eficiente y atención personalizada. Elevamos el estándar de hidratación en cada entrega.
      </p>

      {/* Botón de Acción (Call to Action) para linkear despues a about us*/}
      <div className="pt-4">
        <Link href="/about-us" className="inline-flex bg-[#007aff] hover:bg-[#0058bc] text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-blue-500/30">
          Conocer más
        </Link>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}