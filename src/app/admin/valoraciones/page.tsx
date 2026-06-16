import { prisma } from '../../../lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ReviewCard from '../../../components/ReviewCard';

export default async function AdminValoracionesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; estrellas?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const estrellas = params.estrellas ? parseInt(params.estrellas) : undefined;
  const limit = 10;
  const skip = (page - 1) * limit;

  // 1. Filtros
  const where = estrellas ? { estrellas } : {};

  // 2. Consulta
  const [valoraciones, total] = await Promise.all([
    prisma.valoracion.findMany({
      where,
      orderBy: { fecha: 'desc' },
      skip,
      take: limit,
    }),
    prisma.valoracion.count({ where })
  ]);

  const totalPages = Math.ceil(total / limit);

  // Acción para filtro
  async function handleFilter(formData: FormData) {
    'use server';
    const estrellas = formData.get('estrellas');
    redirect(`/admin/valoraciones?estrellas=${estrellas}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Todas las Valoraciones</h1>
        
        {/* Filtro por Estrellas */}
        <form action={handleFilter} className="flex flex-col sm:flex-row gap-2">
          <label htmlFor="estrellas-filter" className="sr-only">Filtrar por estrellas</label>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              id="estrellas-filter"
              name="estrellas" 
              defaultValue={estrellas || ''}
              className="flex-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#005BC1] outline-none"
            >
              <option value="">Todas las estrellas</option>
              {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} estrellas</option>)}
            </select>
            <button type="submit" className="bg-[#005BC1] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#004a9e] transition-colors whitespace-nowrap">
              Filtrar
            </button>
          </div>
        </form>
      </div>
      
      {/* Vista Mobile (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {valoraciones.map((val) => (
          <ReviewCard 
            key={val.id_valoracion}
            idLabel="Usuario"
            idValue={val.id_usuario}
            stars={val.estrellas}
            comment={val.comentario}
            date={val.fecha.toLocaleDateString()}
          />
        ))}
      </div>

      <div className="hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Usuario</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Estrellas</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Comentario</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {valoraciones.map((val) => (
                <tr key={val.id_valoracion} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">{val.id_usuario}</td>
                  <td className="px-6 py-4 text-sm font-bold text-amber-600 dark:text-amber-400">{val.estrellas} ★</td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{val.comentario}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{val.fecha.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
       <div className="flex justify-between items-center mt-4">
         <Link 
           href={`/admin/valoraciones?page=${page - 1}&estrellas=${estrellas || ''}`}
           className={`px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-100 ${page <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
         >
           Anterior
         </Link>
         <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Página {page} de {totalPages || 1}</span>
         <Link 
           href={`/admin/valoraciones?page=${page + 1}&estrellas=${estrellas || ''}`}
           className={`px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-100 ${page >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
         >
           Siguiente
         </Link>
       </div>
    </div>
  );
}
