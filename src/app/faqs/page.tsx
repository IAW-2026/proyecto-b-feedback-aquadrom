'use client';

import { useState } from "react";
import { Truck, Star, CreditCard, HelpCircle, ChevronDown } from "lucide-react";

// Sub componente para que cada faq sea un acordeón individual
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-slate-100 overflow-hidden transition-all duration-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 hover:bg-slate-50 transition-colors text-left"
      >
        <span className="font-semibold text-slate-700 font-body">{question}</span>
        <ChevronDown 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {/* Contenedor de la respuesta */}
      <div 
        className={`px-4 pb-4 text-slate-600 font-body text-sm transition-all ${
          isOpen ? 'block opacity-100' : 'hidden opacity-0'
        }`}
      >
        <div className="pt-2 border-t border-slate-50">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const faqs = {
    pedidos: [
      { q: "¿Cómo realizo el seguimiento de mi pedido?", a: "Podés ver el estado de tu entrega en tiempo real desde la sección 'Mis Pedidos' en la app principal." },
      { q: "¿Qué pasa si no estoy en mi domicilio?", a: "El repartidor intentará comunicarse con vos; si no hay respuesta, el envío se reprogramará automáticamente." },
      { q: "¿Puedo modificar mi dirección?", a: "Sí, siempre y cuando el pedido no haya salido aún del depósito central." },
    ],
    pagos: [
      { q: "¿Qué medios de pago aceptan?", a: "Aceptamos efectivo, transferencia y tarjetas de débito/crédito a través de Mercado Pago." },
      { q: "¿Cómo obtengo mi factura?", a: "La factura se envía automáticamente a tu mail registrado una vez confirmado el pago." },
    ],
    soporte: [
      { q: "¿Por qué es importante dejar una reseña?", a: "Tus comentarios nos ayudan a mejorar la logística y asegurar la calidad del agua en cada gota." },
      { q: "¿Quién lee mi valoración?", a: "Todas las reseñas son revisadas por nuestro equipo de atención al cliente para resolver problemas rápidamente." },
    ]
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="mt-8 text-center">
        <h1 className="font-headline text-3xl font-bold flex items-center justify-center gap-2 text-blue-500">
          <HelpCircle className="text-primary w-8 h-8 text-blue-500" />
          Centro de Ayuda
        </h1>
        <p className="text-slate-500 mt-2 font-body">Encontrá respuestas rápidas sobre nuestro servicio.</p>
      </section>

      {/* Secciones de FAQ */}
      <div className="space-y-10">
        
        {/* Categoría: Pedidos */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold flex items-center gap-2 text-slate-800">
            <Truck className="text-primary" />
            Pedidos y entregas
          </h2>
          <div className="space-y-3">
            {faqs.pedidos.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </section>

        {/* Categoría: Pagos */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold flex items-center gap-2 text-slate-800">
            <CreditCard className="text-primary" />
            Pagos y facturación
          </h2>
          <div className="space-y-3">
            {faqs.pagos.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </section>

        {/* Categoría: Reseñas */}
        <section className="space-y-4">
          <h2 className="font-headline text-xl font-bold flex items-center gap-2 text-slate-800">
            <Star className="text-primary" />
            Reseñas y Soporte
          </h2>
          <div className="space-y-3">
            {faqs.soporte.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}