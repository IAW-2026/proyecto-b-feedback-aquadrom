import { prisma } from '../../../lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
        <form action={handleFilter} className="flex gap-2">
          <select 
            name="estrellas" 
            defaultValue={estrellas || ''}
            className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#005BC1] outline-none"
          >
            <option value="">Todas las estrellas</option>
            {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} estrellas</option>)}
          </select>
          <button type="submit" className="bg-[#005BC1] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#004a9e] transition-colors">
            Filtrar
          </button>
        </form>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
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
                <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{val.id_usuario}</td>
                <td className="px-6 py-4 text-sm font-bold text-amber-500">{val.estrellas} ★</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{val.comentario}</td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{val.fecha.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <Link 
          href={`/admin/valoraciones?page=${page - 1}&estrellas=${estrellas || ''}`}
          className={`px-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-sm font-medium ${page <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
        >
          Anterior
        </Link>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Página {page} de {totalPages || 1}</span>
        <Link 
          href={`/admin/valoraciones?page=${page + 1}&estrellas=${estrellas || ''}`}
          className={`px-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-sm font-medium ${page >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
        >
          Siguiente
        </Link>
      </div>
    </div>
  );
}
