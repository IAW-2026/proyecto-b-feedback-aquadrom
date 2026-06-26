'use server';

import { prisma } from '../../lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { getSellerIdByUserId } from '../../lib/mockApi';

export async function getSellerStats() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  const sellerId = await getSellerIdByUserId(userId) ?? userId;

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
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  const sellerId = await getSellerIdByUserId(userId) ?? userId;

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
