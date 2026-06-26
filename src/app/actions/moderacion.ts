'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteResena(id_resena: number) {
  try {
    await prisma.resena.delete({
      where: { id_resena },
    });
    revalidatePath('/admin/resenas');
    return { success: true };
  } catch (error) {
    console.error('Error al borrar reseña:', error);
    return { success: false, error: 'No se pudo eliminar la reseña' };
  }
}
