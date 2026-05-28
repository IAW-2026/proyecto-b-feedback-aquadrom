import { getResenaById } from '../../../../app/actions/resenas';
import { Star, Truck, Calendar, MessageSquare, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ViewReviewPage({ params }: { params: { id_resena: string } }) {
  const { id_resena } = await params;
  const idResenaNumber = parseInt(id_resena);
  
  if (isNaN(idResenaNumber)) notFound();

  const result = await getResenaById(idResenaNumber);
  if (!result.success || !result.resena) notFound();

  const resena = result.resena;

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-[720px] mx-auto space-y-8">
        
        {/* Botón Volver */}
        <Link 
          href="/review" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#005BC1] transition-colors font-bold"
        >
          <ArrowLeft size={20} />
          Volver a mis pedidos
        </Link>

        <h1 className="text-3xl font-bold text-slate-900">Detalle de tu Reseña</h1>
        
        <div className="bg-whiterounded-2xl p-8 shadow-sm border border-slate-100">

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Truck className="text-[#005BC1] " />
              <span className="font-bold text-lg text-slate-800">Pedido #{resena.id_pedido}</span>
            </div>
            <span className="text-sm text-slate-500">{resena.fecha.toLocaleDateString()}</span>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-700">Calificación</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={24} 
                  className={star <= resena.estrellas ? 'text-amber-400 fill-amber-400' : 'text-slate-200 '} 
                />
              ))}
            </div>
          </div>

          {resena.comentario && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-700">Comentario</h3>
              <p className="text-slate-600  bg-slate-50  p-4 rounded-xl">{resena.comentario}</p>
            </div>
          )}

          {resena.foto && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-700 ">Foto adjunta</h3>
              <div className="relative w-full h-64 rounded-xl overflow-hidden">
                <Image src={resena.foto} alt="Foto de reseña" fill className="object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

