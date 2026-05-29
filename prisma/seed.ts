import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Repoblando base de datos...');

  // 1. Limpiar (cuidado en producción, pero necesario para desarrollo)
  await prisma.resena.deleteMany({});
  await prisma.pedido.deleteMany({});

  // 2. Insertar pedidos de prueba
  await prisma.pedido.createMany({
    data: [
      { 
        id_pedido: '12345', 
        id_vendedor: 'vend_1', 
        id_comprador: 'user_clerk_1', 
        snapshot_producto_nombre: 'Bidón 20L', 
        snapshot_producto_precio: 4000, 
        estado: 'Entregado', 
        monto: 4000,
        fecha: new Date('2024-05-18T10:00:00Z')
      },
      { 
        id_pedido: '12312', 
        id_vendedor: 'vend_2', 
        id_comprador: 'user_clerk_1', 
        snapshot_producto_nombre: 'Pack Soda', 
        snapshot_producto_precio: 1500, 
        estado: 'Entregado', 
        monto: 1500,
        fecha: new Date('2024-05-10T10:00:00Z')
      },
      { 
        id_pedido: '12290', 
        id_vendedor: 'vend_3', 
        id_comprador: 'user_clerk_1', 
        snapshot_producto_nombre: 'Agua Mineral 20L', 
        snapshot_producto_precio: 4500, 
        estado: 'Entregado', 
        monto: 4500,
        fecha: new Date('2024-05-02T10:00:00Z')
      },
      { 
        id_pedido: '12275', 
        id_vendedor: 'vend_1', 
        id_comprador: 'user_clerk_1', 
        snapshot_producto_nombre: 'Bidón 20L', 
        snapshot_producto_precio: 4000, 
        estado: 'Entregado', 
        monto: 4000,
        fecha: new Date('2024-04-28T10:00:00Z')
      },
    ],
  });

  console.log('Seed completado.');
}

main().catch(console.error).finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
