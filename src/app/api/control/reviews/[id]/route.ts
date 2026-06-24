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
  const idResena = parseInt(id);
  if (isNaN(idResena)) {
    return NextResponse.json({ success: false, error: 'ID inválido' }, { status: 400 });
  }

  try {
    const existing = await prisma.resena.findUnique({ where: { id_resena: idResena } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Reseña no encontrada' }, { status: 404 });
    }

    await prisma.resena.delete({ where: { id_resena: idResena } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    return NextResponse.json({ success: false, error: 'Error al eliminar la reseña' }, { status: 500 });
  }
}
