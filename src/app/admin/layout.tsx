import AdminSidebar from '../../components/AdminSidebar';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar que el usuario esté autenticado
  const user = await currentUser();
  if (!user) {
    // No autenticado -> redirigir al inicio (o login)
    redirect('/');
  }

  // Leer rol desde la metadata pública de Clerk (flexible: 'role' o 'roles')
  const publicMetadata = (user as any)?.publicMetadata ?? {};
  let userRoles: string[] = [];
  if (Array.isArray(publicMetadata.roles)) userRoles = publicMetadata.roles;
  else if (typeof publicMetadata.roles === 'string') userRoles = [publicMetadata.roles];
  else if (publicMetadata.role) userRoles = [publicMetadata.role];

  const isAdmin = userRoles.includes('admin');
  if (!isAdmin) {
    // Usuario autenticado pero no admin -> redirigir
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
