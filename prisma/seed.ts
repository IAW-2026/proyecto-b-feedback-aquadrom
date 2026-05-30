import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Repoblando base de datos con 100 pedidos para 3 usuarios diferentes...');

  // 1. Limpiar (cuidado en producción)
  await prisma.resena.deleteMany({});
  await prisma.pedido.deleteMany({});

  const buyers = ['user_clerk_1', 'user_clerk_2', 'user_clerk_3'];

  // 2. Generar 100 pedidos
  const pedidos = Array.from({ length: 100 }).map((_, i) => ({
    id_pedido: `PED-${1000 + i}`,
    id_vendedor: `VEND-${Math.floor(Math.random() * 5) + 1}`,
    id_comprador: buyers[i % 3], // Cicla entre los 3 usuarios
    snapshot_producto_nombre: `Bidón Premium ${i + 1}`,
    snapshot_producto_precio: 4000 + (i * 10),
    estado: 'Entregado',
    monto: 4000 + (i * 10),
    fecha: new Date(Date.now() - i * 86400000), // Un día más viejo por cada pedido
  }));

  // 3. Insertar
  await prisma.pedido.createMany({
    data: pedidos,
  });

  console.log('Seed completado: 100 pedidos insertados para 3 compradores.');
}

main().catch(console.error).finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
