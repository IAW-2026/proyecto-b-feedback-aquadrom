import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key');
    const expectedKey = process.env.WEBHOOK_API_KEY;

    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    if (!body.id_pedido || !body.id_vendedor || !body.id_comprador) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }
    
    const pedido = await prisma.pedido.create({
      data: {
        id_pedido: body.id_pedido,
        id_vendedor: body.id_vendedor,
        id_comprador: body.id_comprador,
        snapshot_producto_nombre: body.snapshot_producto_nombre,
        snapshot_producto_precio: parseFloat(body.snapshot_producto_precio),
        estado: body.estado,
        fecha: body.fecha ? new Date(body.fecha) : new Date(),
        monto: parseFloat(body.monto),
      }
    });

    return NextResponse.json({ success: true, pedido }, { status: 201 });
  } catch (error: any) {
    console.error('Error al procesar el pedido:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'El pedido ya existe' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al procesar el pedido' }, { status: 500 });
  }
}
