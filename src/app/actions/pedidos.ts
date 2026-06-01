'use server';

import { prisma } from '../../lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function getPedidosByUser(page: number = 1, limit: number = 5) {
  const { userId } = await auth();
  if (!userId) throw new Error('No autorizado');

  const skip = (page - 1) * limit;

  const [pedidos, total] = await Promise.all([
    prisma.pedido.findMany({
      where: { id_comprador: userId },
      orderBy: { fecha: 'desc' },
      skip,
      take: limit,
    }),
    prisma.pedido.count({ where: { id_comprador: userId } })
  ]);

  return { 
    pedidos, 
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  };
}

export async function getPedidoById(id_pedido: string) {
  return await prisma.pedido.findUnique({
    where: { id_pedido }
  });
}
