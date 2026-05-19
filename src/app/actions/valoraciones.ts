'use server';

import { prisma } from '../../lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createValoracion(data: {
  id_usuario: string;
  estrellas: number;
  comentario: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('No autorizado');
  }

  try {
    const valoracion = await prisma.valoracion.create({
      data: {
        id_usuario: userId,
        estrellas: data.estrellas,
        comentario: data.comentario,
      },
    });

    revalidatePath('/value-us');
    return { success: true, valoracion };
  } catch (error) {
    console.error('Error al crear valoración:', error);
    return { success: false, error: 'Error al guardar la valoración' };
  }
}
