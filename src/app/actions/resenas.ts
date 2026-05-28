'use server';

import { prisma } from '../../lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// Crear una reseña (incluyendo la foto opcional)
export async function createResena(data: {
  id_pedido: string;
  id_vendedor: string;
  estrellas: number;
  comentario?: string;
  foto?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('No autorizado');
  }

  try {
    const resena = await prisma.resena.create({
      data: {
        id_pedido: data.id_pedido,
        id_usuario: userId,
        id_vendedor: data.id_vendedor,
        estrellas: data.estrellas,
        comentario: data.comentario,
        foto: data.foto,
      },
    });

    revalidatePath('/review');
    return { success: true, resena };
  } catch (error) {
    console.error('Error al crear reseña:', error);
    return { success: false, error: 'Error al guardar la reseña' };
  }
}

// Obtener reseñas de un usuario
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

// Obtener una reseña por su ID
export async function getResenaById(id_resena: number) {
  try {
    const resena = await prisma.resena.findUnique({
      where: { id_resena },
    });
    return { success: true, resena };
  } catch (error) {
    console.error('Error al obtener reseña:', error);
    return { success: false, error: 'Error al obtener reseña' };
  }
}
