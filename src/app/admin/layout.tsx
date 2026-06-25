import AdminLayoutClient from '../../components/AdminLayoutClient';
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

  const publicMetadata = (user as any)?.publicMetadata ?? {};
  const roles: string[] = Array.isArray(publicMetadata.roles)
    ? publicMetadata.roles
    : publicMetadata.role
      ? [publicMetadata.role]
      : [];

  const isAdmin = roles.includes('admin');
  if (!isAdmin) {
    // Usuario autenticado pero no admin -> redirigir
    redirect('/');
  }

  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
