import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

//Este endpoint es para que la app de analytics pueda obtener estadísticas de la base de datos.

export async function GET(request: Request) {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.ANALYTICS_API_KEY;
  if (expectedKey && apiKey !== expectedKey) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    const [
      totalResenas,
      totalValoraciones,
      totalPedidos,
      avgResenas,
      avgValoraciones,
      resenasGrouped,
      valoracionesGrouped,
      vendedoresUnicos,
    ] = await Promise.all([
      prisma.resena.count(),
      prisma.valoracion.count(),
      prisma.pedido.count(),
      prisma.resena.aggregate({ _avg: { estrellas: true } }),
      prisma.valoracion.aggregate({ _avg: { estrellas: true } }),
      prisma.resena.groupBy({ by: ['estrellas'], _count: { id_resena: true } }),
      prisma.valoracion.groupBy({ by: ['estrellas'], _count: { id_valoracion: true } }),
      prisma.resena.findMany({ select: { id_vendedor: true }, distinct: ['id_vendedor'] }),
    ]);

    const buildCountMap = (groups: { estrellas: number; _count: { [key: string]: number } }[]) => {
      const map: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      groups.forEach((g) => { map[g.estrellas] = g._count[Object.keys(g._count)[0]]; });
      return map;
    };

    return NextResponse.json({
      success: true,
      data: {
        totalResenas,
        totalValoraciones,
        totalPedidos,
        promedioEstrellasResenas: avgResenas._avg.estrellas
          ? parseFloat(avgResenas._avg.estrellas.toFixed(1))
          : 0,
        promedioEstrellasValoraciones: avgValoraciones._avg.estrellas
          ? parseFloat(avgValoraciones._avg.estrellas.toFixed(1))
          : 0,
        resenasPorEstrella: buildCountMap(resenasGrouped),
        valoracionesPorEstrella: buildCountMap(valoracionesGrouped),
        vendedoresConResenas: vendedoresUnicos.length,
      },
    });
  } catch (error) {
    console.error('Error en analytics/stats:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
