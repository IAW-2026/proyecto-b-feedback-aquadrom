import { prisma } from '../../lib/prisma';
import Link from 'next/link';
import { handleFilter } from '../actions/resenaFilter';
import { MessageSquareHeart } from 'lucide-react';


export const revalidate = 0;

export default async function PublicResenasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sellerId?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const sellerId = params.sellerId || '';
  const limit = 10;
  const skip = (page - 1) * limit;

  // 1. Obtener lista de vendedores únicos
  const vendedoresList = await prisma.resena.findMany({
    select: { id_vendedor: true },
    distinct: ['id_vendedor'],
  });

  // 2. Filtros
  const where = sellerId ? { id_vendedor: sellerId } : {};

  // 3. Consultar reseñas
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <MessageSquareHeart className="text-blue-600" size={28} />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reseñas de Proveedores</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-300">Consulta las opiniones de los clientes sobre sus experiencias con los proveedores.</p>
        {/* Desplegable de Vendedores */}
        <form action={handleFilter} className="flex gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="font-bold text-sm text-slate-600 dark:text-slate-300">Filtrar por Vendedor:</label>
          <select 
            name="sellerId" 
            defaultValue={sellerId}
            className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg px-4 py-2"
          >
            <option value="">Todos los vendedores</option>
            {vendedoresList.map(v => (
              <option key={v.id_vendedor} value={v.id_vendedor}>{v.id_vendedor}</option>
            ))}
          </select>
          <button type="submit" className="bg-[#005BC1] text-white px-4 py-2 rounded-lg text-sm font-bold">Filtrar</button>
        </form>

        {/* Tabla de Reseñas */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Pedido</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Estrellas</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Comentario</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Fecha</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-300">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {resenas.map((r) => (
                <tr key={r.id_resena} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">#{r.id_pedido}</td>
                  <td className="px-6 py-4 text-amber-500 font-bold">{r.estrellas} ★</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{r.comentario}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{r.fecha.toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    <Link href={`/resenas/view/${r.id_resena}`} className="text-[#005BC1] dark:text-blue-400 font-bold hover:underline">
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <Link href={`/resenas?page=${page - 1}&sellerId=${sellerId}`} className={`px-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-sm font-medium ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`}>Anterior</Link>
          <span className="text-sm dark:text-white">Página {page} de {totalPages || 1}</span>
          <Link href={`/resenas?page=${page + 1}&sellerId=${sellerId}`} className={`px-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-sm font-medium ${page >= totalPages ? 'pointer-events-none opacity-50' : ''}`}>Siguiente</Link>
        </div>
      </div>
    </main>
  );
}
