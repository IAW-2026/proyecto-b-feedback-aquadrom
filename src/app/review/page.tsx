import { currentUser } from '@clerk/nextjs/server';
import { 
  Calendar, 
  Droplets, 
  ArrowRight, 
  AlertCircle, 
  Star,
  PackageCheck,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { getResenasByUser } from '../actions/getResenas';
import { getPedidosByUser } from '../actions/pedidos';

export const revalidate = 0; 
// Sub-componente 
function SummaryItem({ label, value, icon: Icon, colorClass, subtext }: any) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon size={24} />
        </div>
        <span className="text-2xl font-bold text-slate-800 dark:text-white">{value}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        {subtext && <p className="text-xs text-rose-500 font-medium mt-1">{subtext}</p>}
      </div>
    </div>
  );
}

// Sub-componente 
function OrderReviewCard({ id, date, items, status, rating, pending, id_resena }: any) {
  return (
    <div className={`bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border-l-4 transition-all hover:shadow-md ${
      pending ? 'border-l-[#005BC1]' : 'border-l-slate-200 dark:border-slate-700 opacity-90'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-slate-800 dark:text-white">#{id}</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              pending ? 'bg-[#005BC1]/10 text-[#005BC1]' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
            }`}>
              {status}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              {date}
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
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
                    className={star <= (rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-600'} 
                  />
                ))}
              </div>
              <Link href={`/review/view/${id_resena}`} className="text-[#005BC1] dark:text-blue-400 font-bold text-xs hover:underline">
                Ver Reseña
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function ResenasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const user = await currentUser();
  if (!user) return null;

  const page = parseInt(params.page || '1');
  const limit = 3;

  // 1. Obtener pedidos paginados desde DB y reseñas existentes en paralelo
  const [{ pedidos, total, totalPages }, resenasResult] = await Promise.all([
    getPedidosByUser(page, limit),
    getResenasByUser()
  ]);

  const resenas = resenasResult.success && resenasResult.resenas ? resenasResult.resenas : [];

  const processedOrders = pedidos.map(pedido => {
    const resena = resenas.find(r => r.id_pedido === pedido.id_pedido);
    return {
      id: pedido.id_pedido,
      date: pedido.fecha.toLocaleDateString(),
      items: pedido.snapshot_producto_nombre,
      status: pedido.estado,
      pending: !resena,
      rating: resena?.estrellas,
      id_resena: resena?.id_resena
    };
  });

  // Calculamos el total de pendientes de reseñar para mostrar en el resumen
  const pendingCount = processedOrders.filter(o => o.pending).length;


  return (
    <main className="min-h-screen bg-slate-100 pt-24 pb-16 px-4 rounded-lg">
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
                value={total}
                icon={PackageCheck} 
                colorClass="bg-blue-50  text-blue-600" 
              />
              <SummaryItem 
                label="Pendientes de Calificar" 
                value={pendingCount} 
                icon={pendingCount === 0 ? Award : AlertCircle} 
                colorClass={pendingCount === 0 ? "bg-emerald-50  text-emerald-600 " : "bg-rose-50  text-rose-600 "}
                subtext={pendingCount === 0 ? "¡Todo al día!" : "Acción requerida"} 
              />
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              Historial de Entregas
            </h2>
            
            {processedOrders.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-4 shadow-sm">
                <div className="w-20 h-20 bg-blue-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-[#005BC1]">
                  <PackageCheck size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Aún no tienes pedidos</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Cuando realices tu primer pedido en la aplicación principal de AguaYa, aparecerá aquí para que puedas calificar el servicio.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {processedOrders.map((order) => (
                    <OrderReviewCard key={order.id} {...order} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pt-8 flex justify-center gap-4">
                    <Link 
                      href={`/review?page=${page - 1}`}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      Anterior
                    </Link>
                    <span className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300">Página {page} de {totalPages}</span>
                    <Link 
                      href={`/review?page=${page + 1}`}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all ${page >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      Siguiente
                    </Link>
                  </div>
                )}
              </>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
