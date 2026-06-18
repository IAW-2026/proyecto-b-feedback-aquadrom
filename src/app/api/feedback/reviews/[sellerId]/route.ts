import { prisma } from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.SELLER_API_KEY;

  if (expectedKey && apiKey !== expectedKey) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  const { sellerId } = await params;

  try {
    const resenas = await prisma.resena.findMany({
      where: { id_vendedor: sellerId },
      orderBy: { fecha: 'desc' },
      take: 5,
    });

    const stats = await prisma.resena.aggregate({
      where: { id_vendedor: sellerId },
      _avg: { estrellas: true },
      _count: { id_resena: true },
    });

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
