'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Star, 
  Send, 
  CheckCheck, 
  Monitor, 
  Zap, 
  Smartphone, 
  Bug,
  Lightbulb 
} from 'lucide-react';

// Sub-componente para las etiquetas de logística
function FeedbackChip({ label, icon: Icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 text-sm font-medium ${
        active 
          ? 'border-[#005BC1] bg-[#005BC1]/10 text-[#005BC1]' 
          : 'border-slate-200 text-slate-500 hover:border-[#005BC1] hover:text-[#005BC1]'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

export default function ValoranosPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const tags = [
    { id: 'interfaz', label: 'Interfaz (UI)', icon: Monitor }, 
    { id: 'fluidez', label: 'Fluidez/Velocidad', icon: Zap }, 
    { id: 'facilidad', label: 'Facilidad de uso', icon: Smartphone },
    { id: 'errores', label: 'Reportar un error', icon: Bug },
    { id: 'sugerencia', label: 'Nueva funcionalidad', icon: Lightbulb },
  ];

  const toggleTag = (id: string) => {
    setSelectedTags(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <main className="min-h-screen bg-[#E3F2FD]/30 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-[#E3F2FD] p-8 md:p-12 overflow-hidden relative">
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-headline font-bold text-[#005BC1]">
                ¿Cómo ha sido tu experiencia?
              </h1>
              <p className="text-slate-600 font-body text-lg">
                Tu opinión nos ayuda a mejorar. Valoramos cada detalle para ofrecerte un servicio de hidratación excepcional.
              </p>
              <div className="flex items-center gap-2 text-[#005BC1] font-semibold text-sm">
                <CheckCheck 
                        size={20} 
                        className="text-emerald-500" 
                        strokeWidth={3} 
                />
                    Opiniones 100% verificadas
              </div>
            </div>
            <div className="hidden md:block relative h-48 w-full">
               <Image 
                src="/gotasinfondo.png" 
                alt="AguaYa Feedback"
                fill
                className="object-contain opacity-50"
               />
            </div>
          </div>
        </section>

        {/* Bento Grid de Interacción  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Sistema de Estrellas  */}
          <div className="bg-white rounded-2xl p-6 border border-[#E3F2FD] shadow-sm flex flex-col items-center justify-center space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calificación</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    size={36} 
                    className={star <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} 
                  />
                </button>
              ))}
            </div>
            <p className="font-bold text-[#005BC1]">
              {rating === 5 ? '¡Excelente!' : rating > 0 ? '¡Gracias por calificar!' : 'Selecciona una estrella'}
            </p>
          </div>

          {/* Área de Comentarios */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-[#E3F2FD] shadow-sm space-y-3">
            <label className="block text-sm font-bold text-slate-500">
              Cuéntanos más sobre tu experiencia (opcional) 
            </label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe aquí tus comentarios, sugerencias o agradecimientos..."
              className="w-full h-32 p-4 rounded-xl border-slate-200 focus:border-[#005BC1] focus:ring-4 focus:ring-[#005BC1]/5 transition-all outline-none resize-none text-slate-700"
            />
          </div>

          {/* Selección de aspectos logísticos */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-[#E3F2FD] shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-500">¿Qué es lo que más te ha gustado?</h3>
            <div className="flex flex-wrap gap-3">
              {tags.map(tag => (
                <FeedbackChip 
                  key={tag.id}
                  label={tag.label}
                  icon={tag.icon}
                  active={selectedTags.includes(tag.id)}
                  onClick={() => toggleTag(tag.id)}
                />
              ))}
            </div>
          </div>

          {/* Acción Final*/}
          <div className="md:col-span-3 flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="bg-slate-100 p-2 rounded-full">
                <CheckCheck size={16} />
              </div>
              <p className="text-xs">Su valoración será pública y anónima.</p>
            </div>
            <button 
              className="w-full md:w-auto bg-[#005BC1] hover:bg-[#004a9e] text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#005BC1]/20 transition-all active:scale-95"
            >
              Enviar Valoración
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}