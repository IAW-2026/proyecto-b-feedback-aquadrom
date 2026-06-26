import { prisma } from '../../lib/prisma';
import { MessageSquare, Star, MessageSquareHeart } from 'lucide-react';
import Image from 'next/image';

export default async function AdminDashboard() {
  // Obtener las métricas desde la base de datos
  const totalResenas = await prisma.resena.count();
  const totalValoraciones = await prisma.valoracion.count();
  
  // Promedio de estrellas de las reseñas
  const avgResenas = await prisma.resena.aggregate({
    _avg: { estrellas: true }
  });

  return (
    <div className="space-y-8">
      {/* Header con imagen */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <Image 
              src="/gotaengsinfondo.png" 
              alt="AguaYa admin"
              fill
              className="object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Administrativo</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <StatCard 
          title="Total Reseñas" 
          value={totalResenas.toString()} 
          icon={<MessageSquare className="h-6 w-6 text-blue-600" />} 
        />
        <StatCard 
          title="Promedio Estrellas" 
          value={avgResenas._avg.estrellas?.toFixed(1) || '0'} 
          icon={<Star className="h-6 w-6 text-amber-500" />} 
        />
        <StatCard 
          title="Total de Valoraciones" 
          value={totalValoraciones.toString()} 
          icon={<MessageSquareHeart className="h-6 w-6 text-green-500" />} 
        />

      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4">Resumen de Actividad</h2>
        <p className="text-slate-600">Bienvenido al panel de control. Aquí podrás gestionar todas las reseñas y valoraciones del sistema.</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">{value}</h2>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
    </div>
  );
}
