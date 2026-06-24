import { prisma } from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.ANALYTICS_API_KEY;
  if (expectedKey && apiKey !== expectedKey) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const idValoracion = parseInt(id);
  if (isNaN(idValoracion)) {
    return NextResponse.json({ success: false, error: 'ID inválido' }, { status: 400 });
  }

  try {
    const existing = await prisma.valoracion.findUnique({ where: { id_valoracion: idValoracion } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Valoración no encontrada' }, { status: 404 });
    }

    await prisma.valoracion.delete({ where: { id_valoracion: idValoracion } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar valoración:', error);
    return NextResponse.json({ success: false, error: 'Error al eliminar la valoración' }, { status: 500 });
  }
}
