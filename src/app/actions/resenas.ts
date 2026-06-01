'use server';

import { prisma } from '../../lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// Crear una reseña
export async function createResena(data: {
  id_pedido: string;
  estrellas: number;
  comentario?: string;
  foto?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('No autorizado');
  }

  try {
    // Buscar el pedido para obtener el id_vendedor
    const pedido = await prisma.pedido.findUnique({
      where: { id_pedido: data.id_pedido },
    });

    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    const resena = await prisma.resena.create({
      data: {
        id_pedido: data.id_pedido,
        id_usuario: userId,
        id_vendedor: pedido.id_vendedor, // Obtenido del pedido
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
