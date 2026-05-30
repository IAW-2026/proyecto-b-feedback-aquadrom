import { prisma } from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { sellerId: string } }
) {
  // Await params para obtener el sellerId
  const { sellerId } = await params;

  try {
    // 1. Obtener las últimas 5 reseñas
    const resenas = await prisma.resena.findMany({
      where: { id_vendedor: sellerId },
      orderBy: { fecha: 'desc' },
      take: 5,
    });

    // 2. Calcular promedio y total
    const stats = await prisma.resena.aggregate({
      where: { id_vendedor: sellerId },
      _avg: { estrellas: true },
      _count: { id_resena: true },
    });

    // 3. Responder
    return NextResponse.json({
      promedio: stats._avg.estrellas ? parseFloat(stats._avg.estrellas.toFixed(1)) : 0,
      total: stats._count.id_resena || 0,
      ultimasResenas: resenas,
    });
  } catch (error) {
    console.error('Error en API reviews:', error);
    return NextResponse.json(
      { error: 'Error al obtener los datos del vendedor' }, 
      { status: 500 }
    );
  }
}
