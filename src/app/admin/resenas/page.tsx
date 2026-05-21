import { prisma } from '../../../lib/prisma';
import DeleteResenaButton from '../../../components/DeleteResenaButton';

export default async function AdminResenasPage() {
  const resenas = await prisma.resena.findMany({
    orderBy: { fecha: 'desc' },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Moderación de Reseñas</h1>
      <h4 className="text-lg font-semibold text-slate-700">Visualización y Eliminación de Reseñas</h4>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-sm text-slate-600">Usuario</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-600">Pedido</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-600">Estrellas</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-600">Comentario</th>
              <th className="px-6 py-4 font-bold text-sm text-slate-600">Borrar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {resenas.map((resena) => (
              <tr key={resena.id_resena} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-700">{resena.id_usuario}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{resena.id_pedido}</td>
                <td className="px-6 py-4 text-sm font-bold text-amber-500">{resena.estrellas} ★</td>
                <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-xs">{resena.comentario}</td>
                <td className="px-6 py-4">
                  <DeleteResenaButton id_resena={resena.id_resena} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
