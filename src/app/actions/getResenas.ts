'use server';

import { prisma } from '../../lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function getResenasByUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('No autorizado');
  }

  try {
    const resenas = await prisma.resena.findMany({
      where: { id_usuario: userId },
      orderBy: { fecha: 'desc' },
    });
    return { success: true, resenas };
  } catch (error) {
    console.error('Error al obtener reseñas del usuario:', error);
    return { success: false, error: 'Error al obtener reseñas del usuario' };
  }
}
