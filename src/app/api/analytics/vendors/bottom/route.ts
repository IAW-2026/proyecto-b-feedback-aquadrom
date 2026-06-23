import { prisma } from '../../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

//Este endpoint es para que la app de analytics pueda obtener los peores vendedores de la base de datos.

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.ANALYTICS_API_KEY;
  if (expectedKey && apiKey !== expectedKey) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  const limit = Math.min(50, Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || '10')));

  try {
    const vendors = await prisma.resena.groupBy({
      by: ['id_vendedor'],
      _avg: { estrellas: true },
      _count: { id_resena: true },
      orderBy: { _avg: { estrellas: 'asc' } },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: vendors.map((v) => ({
        id_vendedor: v.id_vendedor,
        totalResenas: v._count.id_resena,
        promedioEstrellas: v._avg.estrellas ? parseFloat(v._avg.estrellas.toFixed(1)) : 0,
      })),
    });
  } catch (error) {
    console.error('Error en analytics/vendors/bottom:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener peores vendedores' }, { status: 500 });
  }
}
