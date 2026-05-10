// src/app/page.tsx
import Image from "next/image";
import { Search, Truck, Recycle, CreditCard, HelpCircle, ChevronDown, Droplets } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Search Section  */}
      <section className="mt-8 text-center space-y-6">
        <h1 className="font-headline text-headline-lg text-slate-900">
          ¿Cómo podemos ayudarte? 
        </h1>
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="text-primary text-2xl" />
          </div>
          <input 
            className="w-full pl-[60px] pr-6 py-6 rounded-xl border-none bg-white shadow-md focus:ring-2 focus:ring-primary/20 transition-shadow text-lg"
            placeholder="Busca respuestas sobre proveedores, bidones o sobre la app..." // 
            type="text"
          />
        </div>
      </section>

      {/* Category Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col items-center text-center space-y-4 cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Truck className="text-3xl" />
          </div>
          <h3 className="font-headline text-xl font-bold">Pedidos y Entregas</h3>
          <p className="text-sm text-slate-500">Rastreo de envíos, horarios de entrega y modificaciones de pedido.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col items-center text-center space-y-4 cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
            <Recycle className="text-3xl" />
          </div>
          <h3 className="font-headline text-xl font-bold">Gestión de Bidones</h3>
          <p className="text-sm text-slate-500">Devolución, recolección y mantenimiento de bidones de agua.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col items-center text-center space-y-4 cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
            <CreditCard className="text-3xl" />
          </div>
          <h3 className="font-headline text-xl font-bold">Pagos</h3>
          <p className="text-sm text-slate-500">Métodos de pago, facturación y gestión de suscripciones.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FAQ Section*/}
        <section className="lg:col-span-7 space-y-6">
          <h2 className="font-headline text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="text-primary" />
            Preguntas Frecuentes
          </h2>
          <div className="space-y-3">
            {[
              "¿Cómo devuelvo mis bidones vacíos?",
              "¿Puedo programar una entrega recurrente?",
              "¿Cuáles son los métodos de pago aceptados?",
              "¿Cómo cancelo o modifico mi pedido?",
              "¿Qué hago si mi bidón llega dañado?"
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-100 overflow-hidden">
                <button className="w-full flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                  <span className="font-semibold text-slate-700">{faq}</span>
                  <ChevronDown className="text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Feedback Aside*/}
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-primary text-slate-900 p-6 rounded-xl shadow-lg relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h3 className="font-headline text-xl font-bold">Tu opinión nos refresca</h3>
              <p className="text-sm opacity-90">Ayúdanos a mejorar nuestro servicio de entrega y calidad del agua.</p>
              <button className="text-slate-900 text-primary px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition-colors">
                Dejar una Reseña 
              </button>
            </div>
          </div>
          
          {/* Pedidos por calificar  */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pedidos por calificar </h3>
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                  <Droplets className="text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-700">Pedido #8821</p>
                  <p className="text-xs text-slate-400">Entregado ayer</p>
                </div>
              </div>
              <button className="text-primary font-bold text-sm border border-blue-100 px-4 py-1 rounded-lg hover:bg-blue-50">
                Calificar
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}