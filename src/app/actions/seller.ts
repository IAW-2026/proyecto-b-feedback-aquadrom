'use server';

import { prisma } from '../../lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function getSellerStats() {
  const { sessionClaims } = await auth();
  const sellerId = (sessionClaims?.metadata as any)?.sellerId;

  if (!sellerId) {
    throw new Error('No sellerId found in metadata');
  }

  try {
    const resenas = await prisma.resena.findMany({
      where: { id_vendedor: sellerId },
    });

    const totalResenas = resenas.length;
    const promedioEstrellas = totalResenas > 0 
      ? (resenas.reduce((acc, curr) => acc + curr.estrellas, 0) / totalResenas).toFixed(1) 
      : "0.0";

    return {
      success: true,
      totalResenas,
      promedioEstrellas,
      sellerId
    };
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    return { success: false, error: 'Error fetching stats' };
  }
}

export async function getSellerResenas() {
  const { sessionClaims } = await auth();
  const sellerId = (sessionClaims?.metadata as any)?.sellerId;

  if (!sellerId) {
    throw new Error('No sellerId found in metadata');
  }

  try {
    const resenas = await prisma.resena.findMany({
      where: { id_vendedor: sellerId },
      orderBy: { fecha: 'desc' },
    });
    return { success: true, resenas };
  } catch (error) {
    console.error('Error fetching seller resenas:', error);
    return { success: false, error: 'Error fetching resenas' };
  }
}
