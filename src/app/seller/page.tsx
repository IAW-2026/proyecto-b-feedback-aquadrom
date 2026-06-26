import { getSellerStats } from '../actions/seller';
import { MessageSquare, Star } from "lucide-react";
import Link from 'next/link';

export default async function SellerDashboardPage() {
  const statsResult = await getSellerStats();

  if (!statsResult.success) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Error de Acceso</h1>
        <p className="text-slate-600 max-w-md">
          No se pudo obtener la información del vendedor. Por favor, contacta al administrador.
        </p>
      </div>
    );
  }

  const { totalResenas, promedioEstrellas, sellerId } = statsResult;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Hola, {sellerId} 👋</h1>
        <p className="text-slate-600">Bienvenido a tu panel de gestión de feedback.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <MessageSquare size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Reseñas</p>
            <p className="text-3xl font-bold text-slate-900">{totalResenas}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Star size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Promedio de Estrellas</p>
            <p className="text-3xl font-bold text-slate-900">{promedioEstrellas} / 5</p>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="bg-blue-700 p-8 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-200">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold">¿Quieres ver el detalle?</h2>
          <p className="text-blue-50 opacity-100">Consulta cada comentario y califíca la satisfacción de tus clientes.</p>
        </div>
        <Link
          href="/seller/resenas"
          className="bg-white text-blue-400 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all whitespace-nowrap"
        >
          Ver todas mis reseñas
        </Link>
      </div>
    </div>
  );
}