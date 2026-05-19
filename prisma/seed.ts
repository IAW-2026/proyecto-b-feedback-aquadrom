import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Limpiar tablas
  await prisma.resena.deleteMany({});
  await prisma.valoracion.deleteMany({});
  await prisma.adminFeedback.deleteMany({});

  // Crear Reseñas de prueba
  await prisma.resena.create({
    data: {
      id_pedido: 'pedido_001',
      id_usuario: 'user_clerk_1',
      id_vendedor: 'vendedor_clerk_1',
      estrellas: 5,
      comentario: 'Excelente vendedor, producto de calidad y entrega rápida',
      foto: 'https://example.com/foto1.jpg',
    },
  });

  await prisma.resena.create({
    data: {
      id_pedido: 'pedido_002',
      id_usuario: 'user_clerk_2',
      id_vendedor: 'vendedor_clerk_2',
      estrellas: 4,
      comentario: 'Muy buena experiencia, recomendado',
      foto: 'https://example.com/foto2.jpg',
    },
  });

  await prisma.resena.create({
    data: {
      id_pedido: 'pedido_003',
      id_usuario: 'user_clerk_3',
      id_vendedor: 'vendedor_clerk_1',
      estrellas: 3,
      comentario: 'Producto OK, pero la entrega tardó más de lo esperado',
    },
  });

  // Crear Valoraciones de prueba
  await prisma.valoracion.create({
    data: {
      id_pedido: 'pedido_004',
      id_usuario: 'user_clerk_4',
      id_vendedor: 'vendedor_clerk_2',
      comentario: 'Buena atención al cliente',
      estrellas: 4,
    },
  });

  await prisma.valoracion.create({
    data: {
      id_pedido: 'pedido_005',
      id_usuario: 'user_clerk_5',
      id_vendedor: 'vendedor_clerk_1',
      comentario: 'Excelente servicio general',
      estrellas: 5,
    },
  });

  // Crear Admins de prueba
  await prisma.adminFeedback.create({
    data: {
      id_usuario: 'admin_clerk_1',
      nombre: 'Administrador Principal',
    },
  });

  await prisma.adminFeedback.create({
    data: {
      id_usuario: 'admin_clerk_2',
      nombre: 'Moderador de Contenido',
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
