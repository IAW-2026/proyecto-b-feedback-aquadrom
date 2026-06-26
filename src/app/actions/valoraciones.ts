'use server';

import { prisma } from '../../lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// Crear una valoración de la aplicación
export async function createValoracion(data: {
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

// Obtener todas las valoraciones de la aplicación (para los administradores)
export async function getValoraciones() {
  try {
    const valoraciones = await prisma.valoracion.findMany({
      orderBy: { fecha: 'desc' },
    });
    return { success: true, valoraciones };
  } catch (error) {
    console.error('Error al obtener valoraciones:', error);
    return { success: false, error: 'Error al obtener valoraciones' };
  }
}
