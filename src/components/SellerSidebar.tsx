'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  ChevronLeft 
} from 'lucide-react';

export default function SellerSidebar({ 
  isOpen = false, 
  setIsOpen = () => {} 
}: { 
  isOpen?: boolean; 
  setIsOpen?: (open: boolean) => void; 
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/seller' },
    { name: 'Mis Reseñas', icon: MessageSquare, path: '/seller/resenas' },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 h-screen flex flex-col transition-transform duration-300 ease-in-out
      md:relative md:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          Panel Seller
        </h2>
        <button 
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar menú lateral"
          className="md:hidden p-1 text-slate-500 hover:text-slate-800"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <Link
          href="/" 
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 text-slate-500 hover:text-rose-600 transition-colors w-full px-4 py-2"
        >
          <ChevronLeft size={20} />
          <span className="font-medium text-sm">Volver al sitio</span>
        </Link>
      </div>
    </aside>
  );
}
