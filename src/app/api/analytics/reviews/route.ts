import { prisma } from '../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


//Este endpoint es para que la app de analytics pueda obtener las reseñas de la base de datos.

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.ANALYTICS_API_KEY;
  if (expectedKey && apiKey !== expectedKey) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const estrellas = searchParams.get('estrellas') ? parseInt(searchParams.get('estrellas')!) : undefined;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const skip = (page - 1) * limit;

  const where: any = {};
  if (estrellas && estrellas >= 1 && estrellas <= 5) where.estrellas = estrellas;
  if (startDate || endDate) {
    where.fecha = {};
    if (startDate) where.fecha.gte = new Date(startDate);
    if (endDate) where.fecha.lte = new Date(endDate);
  }

  try {
    const [items, total] = await Promise.all([
      prisma.resena.findMany({
        where,
        orderBy: { fecha: 'desc' },
        skip,
        take: limit,
      }),
      prisma.resena.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Error en analytics/reviews:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener reseñas' }, { status: 500 });
  }
}
