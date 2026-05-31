'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  ShieldCheck, 
  ChevronLeft 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Reseñas', icon: MessageSquare, path: '/admin/resenas' },
    { name: 'Valoraciones', icon: Users, path: '/admin/valoraciones' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col">
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          Admin Feedback
        </h2>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-[#005BC1] text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 text-slate-500 hover:text-rose-600 transition-colors w-full px-4 py-2">
          <ChevronLeft size={20} />
          <span className="font-medium text-sm">Volver al sitio</span>
        </button>
      </div>
    </aside>
  );
}
