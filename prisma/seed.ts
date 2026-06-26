import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const comentariosValoraciones = [
  'Excelente servicio, muy rápido y eficiente.',
  'Buena experiencia, el repartidor fue muy amable.',
  'El agua llegó en perfecto estado.',
  'Podrían mejorar el tiempo de entrega.',
  'Muy conforme con el servicio.',
  'La app es fácil de usar y muy intuitiva.',
  'El pedido llegó antes de lo esperado.',
  'Buena calidad del agua, se nota la diferencia.',
  'El repartidor no siguió las instrucciones de entrega.',
  'Siempre pido por esta app, nunca tuve problemas.',
  'La interfaz es clara y los pagos son seguros.',
  'Tardaron demasiado en entregar, casi 2 horas.',
  'El seguimiento en tiempo real es muy útil.',
  'Me gustaría que tengan más métodos de pago.',
  'El agua tenía un sabor extraño, no me gustó.',
  'Atención al cliente excelente, resolvieron mi problema rápido.',
  'Muy buena relación calidad-precio.',
  'La entrega fue correcta pero el repartidor no fue muy amable.',
  'Falta mejorar la comunicación con el repartidor.',
  'Todo perfecto, seguiré comprando aquí.',
  'El sistema de reseñas es muy útil para elegir vendedor.',
  'Tuvieron un error con mi dirección pero lo resolvieron.',
  'Recomiendo esta app a todos mis conocidos.',
  'El botellón llegó con una pequeña abolladura.',
  'Muy contento con el servicio de suscripción mensual.',
];

async function main() {
  console.log('Repoblando base de datos...');

  // 1. Limpiar todo
  await prisma.resena.deleteMany({});
  await prisma.valoracion.deleteMany({});
  await prisma.pedido.deleteMany({});

  console.log('Datos anteriores eliminados.');

  // ──────────────────────────────────────────────
  // PEDIDOS (100)
  // ──────────────────────────────────────────────

  const buyers = ['user_clerk_1', 'user_clerk_2', 'user_clerk_3'];

  const sellers = [
    'cmpvp75rp0000ugliqx0ksd22', // agua2
    'cmpurfqxv0000cslii6aablh3', // agusCondori
    'cmpvxr5er000004l51nrtqen5', // Test Vendedor 1
    'cmpvzfw5c000004jscdsssg2x', // Industrias Alamo
    'cmpx4ofsg000004kwilyw1gab', // Agua Pura
  ];

  const pedidos = Array.from({ length: 100 }).map((_, i) => ({
    id_pedido: `PED-${1000 + i}`,
    id_vendedor: sellers[Math.floor(Math.random() * sellers.length)],
    id_comprador: buyers[i % 3],
    snapshot_producto_nombre: `Bidón Premium ${i + 1}`,
    snapshot_producto_precio: 4000 + (i * 10),
    estado: 'Entregado',
    monto: 4000 + (i * 10),
    fecha: new Date(Date.now() - i * 86400000),
  }));

  await prisma.pedido.createMany({ data: pedidos });
  console.log('✓ 100 pedidos insertados.');

  // ──────────────────────────────────────────────
  // VALORACIONES (264)
  // ──────────────────────────────────────────────

  const userIds = [
    'user_3EYhyDdLgXfa60wujtLbOhIrCgy',
    'user_3EYpVjadm0kllwQ9HqCwDM3HUSO',
    'user_3DPQsS2GaIhdsaO1cgHznVJ4XCw',
    'user_3FbSGn0g7M1AKsCM7o01DTggmO1',
  ];

  const totalValoraciones = 264;

  const tresMesesAtras = new Date();
  tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

  const rangoMs = Date.now() - tresMesesAtras.getTime();

  const valoraciones = Array.from({ length: totalValoraciones }).map(() => ({
    id_usuario: userIds[Math.floor(Math.random() * userIds.length)],
    comentario: comentariosValoraciones[Math.floor(Math.random() * comentariosValoraciones.length)],
    estrellas: Math.floor(Math.random() * 5) + 1,
    fecha: new Date(tresMesesAtras.getTime() + Math.floor(Math.random() * rangoMs)),
  }));

  await prisma.valoracion.createMany({ data: valoraciones });
  console.log(`✓ ${totalValoraciones} valoraciones insertadas.`);

  console.log('Seed completado.');
}

main().catch(console.error).finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
