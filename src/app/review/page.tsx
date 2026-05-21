import { currentUser } from '@clerk/nextjs/server';
import { 
  Calendar, 
  Droplets, 
  ArrowRight, 
  ChevronDown, 
  AlertCircle, 
  Star,
  PackageCheck,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { getResenasByUser } from '../actions/getResenas';

export const revalidate = 0; 

// Sub-componente 
function SummaryItem({ label, value, icon: Icon, colorClass, subtext }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon size={24} />
        </div>
        <span className="text-2xl font-bold text-slate-800">{value}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        {subtext && <p className="text-xs text-rose-500 font-medium mt-1">{subtext}</p>}
      </div>
    </div>
  );
}

// Sub-componente 
function OrderReviewCard({ id, date, items, status, rating, pending }: any) {
  return (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border-l-4 transition-all hover:shadow-md ${
      pending ? 'border-l-[#005BC1]' : 'border-l-slate-200 opacity-90'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-slate-800">#{id}</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              pending ? 'bg-[#005BC1]/10 text-[#005BC1]' : 'bg-slate-100 text-slate-500'
            }`}>
              {status}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              {date}
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <Droplets size={16} className="text-[#005BC1]" />
              {items}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {pending ? (
            <Link
              href={`/review/${id}`}
              className="w-full md:w-auto bg-[#005BC1] hover:bg-[#004a9e] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#005BC1]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Calificar Entrega
              <ArrowRight size={16} />
            </Link>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={18} 
                    className={star <= (rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} 
                  />
                ))}
              </div>
              <button className="text-[#005BC1] font-bold text-xs hover:underline">
                Ver Reseña
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function ResenasPage() {
  const user = await currentUser();
  const resenasResult = await getResenasByUser();
  const resenas = resenasResult.success && resenasResult.resenas ? resenasResult.resenas : [];

  const orders = [
    { id: '12345', date: '18 de Mayo, 2024', items: '2x 20L Premium', status: 'Entregado' }, 
    { id: '12312', date: '10 de Mayo, 2024', items: '1x 20L Premium', status: 'Completado' }, 
    { id: '12290', date: '02 de Mayo, 2024', items: '3x 20L Premium', status: 'Completado' }, 
    { id: '12275', date: '28 de Abril, 2024', items: '2x 20L Premium', status: 'Entregado' }, 
  ];

  const processedOrders = orders.map(order => {
    const resena = resenas.find(r => r.id_pedido === order.id);
    return {
      ...order,
      pending: !resena,
      rating: resena?.estrellas
    };
  });

  const pendingCount = processedOrders.filter(o => o.pending).length;

  return (
    <main className="min-h-screen bg-slate-50/50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <section className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-slate-900">
            Pedidos de {user?.firstName || 'Usuario'}
          </h1>
          <p className="text-slate-500 font-body text-lg">
            Tu opinión nos ayuda a mejorar nuestro servicio de entrega 
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <aside className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <SummaryItem 
                label="Pedidos Totales" 
                value={orders.length}
                icon={PackageCheck} 
                colorClass="bg-blue-50 text-blue-600" 
              />
              <SummaryItem 
                label="Pendientes de Calificar" 
                value={pendingCount} 
                icon={pendingCount === 0 ? Award : AlertCircle} 
                colorClass={pendingCount === 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}
                subtext={pendingCount === 0 ? "¡Todo al día!" : "Acción requerida"} 
              />
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              Historial de Entregas
            </h2>
            <div className="space-y-4">
              {processedOrders.map((order) => (
                <OrderReviewCard key={order.id} {...order} />
              ))}
            </div>

            <div className="pt-8 flex justify-center">
              <button className="flex items-center gap-2 px-8 py-3 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                Ver Pedidos Anteriores 
                <ChevronDown size={18} />
              </button>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
