import SellerLayoutClient from '../../components/SellerLayoutClient';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    redirect('/');
  }

  const publicMetadata = (user as any)?.publicMetadata ?? {};
  const role = publicMetadata.role;

  if (role !== 'seller') {
    redirect('/');
  }

  return (
    <SellerLayoutClient>
      {children}
    </SellerLayoutClient>
  );
}
