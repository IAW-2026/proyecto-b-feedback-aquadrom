import { prisma } from '../../lib/prisma';
//import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'; // Asumiendo que usarás componentes UI estándar
import { MessageSquare, Users, Star } from 'lucide-react';

export default async function AdminDashboard() {
  // Obtener métricas básicas desde la base de datos
  const totalResenas = await prisma.resena.count();
  const totalValoraciones = await prisma.valoracion.count();
  const totalAdmins = await prisma.adminFeedback.count();
  
  // Promedio simple de estrellas de las reseñas
  const avgResenas = await prisma.resena.aggregate({
    _avg: { estrellas: true }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard Administrativo</h1>
      
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
          title="Administradores" 
          value={totalAdmins.toString()} 
          icon={<Users className="h-6 w-6 text-purple-600" />} 
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
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
    </div>
  );
}
