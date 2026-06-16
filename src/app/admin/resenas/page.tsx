import { prisma } from '../../../lib/prisma';
import DeleteResenaButton from '../../../components/DeleteResenaButton';
import Link from 'next/link';
import ReviewCard from '../../../components/ReviewCard';

export default async function AdminResenasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  // 1. Configuración de Paginación y Búsqueda (await necesario)
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.q || '';
  const limit = 5; // Número de reseñas por página de la paginacion
  const skip = (page - 1) * limit;

  // 2. Filtros para Prisma
  const where = search ? {
    OR: [
      { id_pedido: { contains: search, mode: 'insensitive' } as any },
      { comentario: { contains: search, mode: 'insensitive' } as any },
      { id_usuario: { contains: search, mode: 'insensitive' } as any }
    ]
  } : {};

  // 3. Consultar datos en paralelo (registros + total para paginación)
  const [resenas, total] = await Promise.all([
    prisma.resena.findMany({
      where,
      orderBy: { fecha: 'desc' },
      skip,
      take: limit,
    }),
    prisma.resena.count({ where })
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Moderación de Reseñas</h1>
        
        {/* Buscador */}
        <form action="/admin/resenas" method="GET" className="flex flex-col sm:flex-row gap-2">
          <input 
            name="q" 
            defaultValue={search} 
            placeholder="Buscar pedido..."
            className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#005BC1] outline-none w-full sm:w-64"
          />
          <button type="submit" className="bg-[#005BC1] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#004a9e] transition-colors whitespace-nowrap">
            Buscar
          </button>
        </form>
      </div>
      
      {/* Vista Mobile (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {resenas.map((resena) => (
          <ReviewCard 
            key={resena.id_resena}
            idLabel="Usuario"
            idValue={resena.id_usuario}
            subtitle={`Pedido #${resena.id_pedido}`}
            stars={resena.estrellas}
            comment={resena.comentario || ''}
            date={resena.fecha.toLocaleDateString()}
            action={<DeleteResenaButton id_resena={resena.id_resena} />}
          />
        ))}
      </div>

      <div className="hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Usuario</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Pedido</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Estrellas</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Comentario</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Borrar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {resenas.map((resena) => (
                <tr key={resena.id_resena} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">{resena.id_usuario}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">{resena.id_pedido}</td>
                  <td className="px-6 py-4 text-sm font-bold text-amber-600 dark:text-amber-400">{resena.estrellas} ★</td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200 truncate max-w-xs">{resena.comentario}</td>
                  <td className="px-6 py-4">
                    <DeleteResenaButton id_resena={resena.id_resena} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
       <div className="flex justify-between items-center mt-4">
         <Link 
           href={`/admin/resenas?page=${page - 1}&q=${search}`}
           className={`px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-100 ${page <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
         >
           Anterior
         </Link>
         <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Página {page} de {totalPages || 1}</span>
         <Link 
           href={`/admin/resenas?page=${page + 1}&q=${search}`}
           className={`px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-100 ${page >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
         >
           Siguiente
         </Link>
       </div>
    </div>
  );
}
