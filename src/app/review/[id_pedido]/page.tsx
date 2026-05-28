'use client';

import { useState } from 'react';
import { Star, Truck, Camera, Edit3, X } from 'lucide-react';
import { createResena } from '../../actions/resenas';
import { useRouter, useParams } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';

// Sub-componente para las etiquetas rápidas
function QuickTag({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full border text-sm transition-all ${
        isActive 
          ? 'bg-[#005BC1] text-white border-[#005BC1]' 
          : 'border-slate-300 text-slate-700 hover:border-[#005BC1]'
      }`}
    >
      {label}
    </button>
  );
}

// Sub-componente para la fila de estrellas (reutilizable)
function StarRatingRow({ value, onChange, size = 24 }: { value: number, onChange: (val: number) => void, size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star 
            size={size} 
            className={star <= (hover || value) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-[#005BC1]'} 
          />
        </button>
      ))}
    </div>
  );
}

export default function CreateReviewPage() {
  const router = useRouter();
  const params = useParams();
  const id_pedido = params.id_pedido as string;

  // Estados para capturar toda la información del formulario
  const [overallRating, setOverallRating] = useState(0);
  const [comment, setComment] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const labels = ['Terrible', 'Malo', 'Regular', 'Bueno', '¡Excelente!'];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createResena({
        id_pedido: id_pedido,
        id_vendedor: 'vendedor_placeholder_id', // En etapa 3, esto vendrá de la API del Seller
        estrellas: overallRating,
        comentario: comment,
        foto: imageUrl || undefined,
      });

      if (result.success) {
        alert('¡Reseña enviada con éxito!');
        router.push('/review'); // Redirigir al historial
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error inesperado al enviar la reseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-180 mx-auto space-y-10">
        
        {/* Encabezado de Contexto */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-slate-900 mb-2">
            Comparte tu Experiencia
          </h1>
          <p className="text-slate-500 font-body max-w-lg mx-auto">
            Ayúdanos a mantener el agua fluyendo perfectamente. Cuéntanos cómo nos fue en tu última entrega.
          </p>
        </div>

        {/* Resumen del Pedido */}
        <div className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#005BC1]/10 text-[#005BC1] rounded-xl flex items-center justify-center">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#005BC1] uppercase tracking-wider">Pedido #{id_pedido}</p>
              <p className="font-bold text-slate-800">2x 20L Garrafones de Agua</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Entregado el</p>
            <p className="font-bold text-slate-800">18 de Mayo, 2024</p>
          </div>
        </div>

        {/* Formulario de Reseña */}
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Valoración General */}
          <section className="text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Calificación General</h2>
            <div className="flex justify-center">
              <StarRatingRow value={overallRating} onChange={setOverallRating} size={48} />
            </div>
            <p className="text-sm text-[#005BC1] font-bold uppercase tracking-widest min-h-5">
              {overallRating > 0 ? labels[overallRating - 1] : 'Toca una estrella para calificar'}
            </p>
          </section>



          {/* Caja de Comentarios */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-lg font-bold text-slate-800">Cuéntanos más</h3>
              <span className={`text-xs font-bold ${comment.length > 450 ? 'text-rose-500' : 'text-slate-400'}`}>
                {comment.length} / 500
              </span>
            </div>
            <div className="relative group">
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                placeholder="Describe el servicio del repartidor, la calidad del agua, o cualquier otra cosa que quieras compartir..."
                className="w-full min-h-35 p-4 rounded-2xl border border-slate-200 focus:border-[#005BC1] focus:ring-4 focus:ring-[#005BC1]/10 transition-all outline-none font-body text-slate-700 resize-none bg-white"
              />
              <div className="absolute bottom-4 right-4 text-slate-300 pointer-events-none">
                <Edit3 size={18} />
              </div>
            </div>
          </section>

          {/* Subida de Fotos */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Añadir Foto (Opcional)</h3>
            
            {imageUrl ? (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200">
                <Image src={imageUrl} alt="Reseña" fill className="object-cover" />
                <button 
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <CldUploadWidget
                uploadPreset="imagenesresenas" // Asegúrate de tener este preset configurado en Cloudinary
                onSuccess={(result: any) => {
                  setImageUrl(result.info.secure_url);
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="w-full relative overflow-hidden bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-[#005BC1] hover:bg-[#005BC1]/5 transition-all group"
                  >
                    <div className="w-16 h-16 bg-[#005BC1]/10 text-[#005BC1] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                      <Camera size={32} />
                    </div>
                    <p className="font-bold text-slate-800 mb-1">Haz clic para subir una foto</p>
                  </button>
                )}
              </CldUploadWidget>
            )}
          </section>


          {/* Botones de Acción */}
          <div className="flex flex-col-reverse md:flex-row gap-4 pt-4">
            <button 
              type="button" 
              className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Guardar Borrador
            </button>
            <button 
              type="submit" 
              disabled={overallRating === 0}
              className="flex-2 px-6 py-4 rounded-xl font-bold text-white bg-[#005BC1] shadow-lg shadow-[#005BC1]/20 hover:bg-[#004a9e] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar Reseña
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}