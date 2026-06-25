import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key');
    const expectedKey = process.env.WEBHOOK_API_KEY;

    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.id_pedido) {
      return NextResponse.json(
        { error: 'Falta id_pedido' },
        { status: 400 }
      );
    }

    const buyerUrl = process.env.BUYER_API_URL;
    const buyerKey = process.env.BUYER_API_KEY;

    if (!buyerUrl || !buyerKey) {
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }

    const res = await fetch(`${buyerUrl}/api/orders/${body.id_pedido}`, {
      headers: { 'x-api-key': buyerKey },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Error al obtener el pedido desde Buyer App' },
        { status: 502 }
      );
    }

    const json = await res.json();
    const order = json.order;

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado en Buyer App' }, { status: 404 });
    }

    const nombreProductos = order.items
      ?.map((item: any) => item.name)
      .filter(Boolean)
      .join(', ') || '';

    const pedido = await prisma.pedido.create({
      data: {
        id_pedido: order.order_id,
        id_vendedor: order.vendor_id,
        id_comprador: order.buyer_id,
        snapshot_producto_nombre: nombreProductos,
        snapshot_producto_precio: order.total,
        estado: order.status,
        fecha: new Date(order.created_at),
        monto: order.total,
      },
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
